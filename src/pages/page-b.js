// src/pages/page-b.js — SVG-схема вместо картинки, текст сохранён
export async function render(container) {
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
          <polygon class="s1-line s2-default"
                   data-name="Криокомната"
                   points="12,7 64,7 64,44 12,44" />
          <polygon class="s1-line s3-active"
                   data-name="Комната проходная"
                   points="
                     30,44  42,44  42,61  53,61  53,79
                     27,79  27,118 49,118 49,136 11,136
                     11,61  30,61" />

          <!-- Точки (радиус задаётся стилями: var(--dot-r)) -->
          <circle class="s1-line dot-place" cx="20"  cy="69"  r="2.6" />
          <circle class="s1-line dot-way" cx="20"  cy="130" r="2.6" />
        </svg>
      </div>

      <figcaption>
        <strong>
          Согласно результатам проведённых экспедиций на планете LV-426, зафиксировано присутствие неизвестной, ранее не классифицированной формы жизни.<br><br>
          В соответствии с уставом компании Weyland-Yutani о реагировании на внеземные сигналы неопознанного происхождения, экипажу грузового судна USCSS <em>Nostromo</em> предписано осуществить посадку, локализовать источник сигнала и провести первичное полевое исследование.<br><br>
          Ваша текущая задача — найти ключ ввода, необходимый для активации шлюзового механизма и получения доступа в следующий отсек.<br><br>
          Помните: любые образцы, артефакты и данные подлежат немедленной передаче в корпоративный исследовательский отдел. Несанкционированное вмешательство или уничтожение находок строго запрещено.
        </strong>
      </figcaption>
    </figure>
  `;
  container.appendChild(el);
}
export function destroy() {}
