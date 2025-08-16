// src/pages/page-c.js — страница C: добавлен звук сирены (Web Audio API, бесшовный луп)
let ctx, gain, buffer, source;

// --- FIX: защита от «подвисшей» сирены и наложений ---
let __c_teardown = [];
function bindGlobalCleanup() {
  if (__c_teardown.length) return; // уже привязано
  const onHashChange = () => stopSiren();
  const onPageHide = () => stopSiren();
  const onBeforeUnload = () => stopSiren();
  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('beforeunload', onBeforeUnload);
  __c_teardown = [
    ['hashchange', onHashChange],
    ['pagehide', onPageHide],
    ['beforeunload', onBeforeUnload],
  ];
}
function unbindGlobalCleanup() {
  __c_teardown.forEach(([type, handler]) => {
    try { window.removeEventListener(type, handler) } catch {}
  });
  __c_teardown = [];
}

/** Создаёт/возвращает AudioContext и GainNode */
function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    gain = ctx.createGain();
    gain.gain.value = 0; // начнем с тишины — дальше плавный fade-in
    gain.connect(ctx.destination);
  }
  return ctx;
}

/** Гарантирует, что аудио разблокируется пользовательским жестом, если автоплей запрещён */
async function ensureInteraction() {
  const c = getCtx();
  if (c.state === 'running') return;
  try {
    await c.resume();
    return;
  } catch {}
  // Если браузер требует жест — повесим одноразовые слушатели
  await new Promise((resolve) => {
    const onAny = () => {
      c.resume().finally(resolve);
      window.removeEventListener('pointerdown', onAny);
      window.removeEventListener('keydown', onAny);
    };
    window.addEventListener('pointerdown', onAny, { once: true });
    window.addEventListener('keydown', onAny, { once: true });
  });
}

/** Загружает и декодирует буфер (кэшируется) */
async function loadBuffer() {
  if (buffer) return buffer;
  const res = await fetch('/sounds/siren.wav');
  const arr = await res.arrayBuffer();
  buffer = await getCtx().decodeAudioData(arr);
  return buffer;
}

/** Запуск сирены: бесшовный луп + плавный fade-in */
async function startSiren() {
  // FIX: перед запуском — глушим возможный предыдущий источник
  stopSiren();

  const c = getCtx();
  await ensureInteraction();                 // разблокируем аудио, если нужно
  const buf = await loadBuffer();

  // каждый запуск — новый источник
  source = c.createBufferSource();
  source.buffer = buf;
  source.loop = true;                        // циклично и бесшовно
  source.connect(gain);

  const now = c.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(0.9, now + 0.35); // плавный вход ~350ms

  source.start(0);
}

/** Остановка сирены: плавный fade-out и корректное завершение */
function stopSiren() {
  if (!ctx || !gain) return;
  const c = ctx;
  const now = c.currentTime;
  try {
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.0, now + 0.25); // плавный выход ~250ms

    if (source) {
      // остановим чуть позже, когда громкость уже ~0
      source.stop(now + 0.26);
      source.disconnect();
      source = null;
    }
  } catch {}
}

// src/pages/page-c.js — SVG-схема вместо картинки, текст сохранён
export async function render(container) {
  // FIX: страховка при повторном заходе — остановим прежний звук
  stopSiren();

  const el = document.createElement('section');
  el.className = 'page';
  el.innerHTML = `
    <figure>
      <div class="wrap">
        <!-- ЕДИНАЯ КООРДИНАТНАЯ СЕТКА 0..200 -->
        <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" aria-label="Базовая площадка 0..200">
          <!-- Рамка -->
          <rect class="s1-line s2-default" x="0" y="0" width="200" height="200" />

          <!-- Комнаты -->
          <polygon class="s1-line s6-threat"
                   data-name="Криокомната"
                   points="12,7 64,7 64,44 12,44" />
          <polygon class="s1-line s2-default"
                   data-name="Комната проходная"
                   points="
                     30,44  42,44  42,61  53,61  53,79
                     27,79  27,118 49,118 49,136 11,136
                     11,61  30,61" />
          <polygon class="s1-line s2-default"
                   data-name="Шлюзовая комната"
                   points="
                     49,118  130,118  130,89  157,89 157,136  49,136" />
          <polygon class="s1-line s3-active"
                   data-name="Комната управления"
                   points="49,99 88,99 88,118 49,118" />

          <!-- Точки (радиус задаётся стилями: var(--dot-r)) -->
          <circle class="s1-line dot-place" cx="20"  cy="130" r="2.6" />
          <circle class="s1-line dot-way"   cx="59"  cy="110" r="2.6" />
        </svg>
      </div>

      <figcaption>
        <strong>
          Доступ подтверждён. Шлюзовой механизм активирован — отсек открыт.<br><br>
          Внимание: зафиксированы системные неполадки. Обнаружена частичная разгерметизация сектора криптосна. Атмосферное давление падает.<br><br>
          Регистрируется быстро распространяющаяся декомпрессия по правому борту.<br><br>
          Необходимо немедленно покинуть текущую локацию и направиться в рубку управления для получения дальнейших распоряжений.<br><br>
          Выполнение приказа — критически важно для сохранения целостности судна и экипажа.
        </strong>
      </figcaption>
    </figure>
  `;
  container.appendChild(el);

  // === СТАРТ СИРЕНЫ ПО ВХОДУ НА page-c ===
  // FIX: подписка на глобальные события для гарантированной остановки при уходе
  bindGlobalCleanup();
  startSiren().catch(() => {
    // Если автоплей заблокирован — звук включится при первом клике/клавише (ensureInteraction ставит слушатели)
  });
}

// При уходе со страницы (роутер вызывает destroy) — аккуратно глушим сирену
export function destroy() {
  stopSiren();

  // FIX: снимаем глобальные подписки
  unbindGlobalCleanup();
}
