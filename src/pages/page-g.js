// src/pages/page-g.js — финальная страница: скрываем глобальный #controls (поле ввода/кнопка/"Введите код")
export async function render(container) {
  // Спрятать глобальный блок управления, если он существует (в нём поле ввода, кнопка "Перейти" и текст "Введите код")
  const controls = document.getElementById('controls');
  if (controls) {
    controls.dataset.prevDisplay = controls.style.display || '';
    controls.style.display = 'none';
  }

  const el = document.createElement('section');
  el.className = 'page';

  el.innerHTML = `
    <div class="glitch-animate">
      <figure>
        <div class="wrap">
          <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" aria-label="Базовая площадка 0..200">
            <rect class="s1-line s2-default" x="0" y="0" width="200" height="200" />
            <!-- Комнаты -->
            <polygon class="s1-line s3-active" data-name="Реакторная" points="157,118 191,118 191,194 157,194" />
            <!-- Точки -->
            <circle class="s1-line dot-way" cx="175" cy="15" r="2.6" />
            <circle class="s1-line dot-way" cx="45" cy="37" r="2.6" />
            <circle class="s1-line dot-way" cx="76" cy="89" r="2.6" />
            <circle class="s1-line dot-way" cx="115" cy="120" r="2.6" />
            <circle class="s1-line dot-place" cx="180" cy="178" r="2.6" />
          </svg>
        </div>
        <figcaption>
          <strong>
            ...сигн..//.. сбой.. кана..#ERR.. <br><br>
            БЕГИ... /// ...ОПАСНОСТЬ... не оста... <br><br>
            ...унос.. НОГИ... шлюз... закр.. не... позд... <br><br>
            /// треск... шум... СМЕРТЕЛЬНАЯ УГРОЗА... <br><br>
            эвакуац... отклон.. протокол... авар... <br><br>
            ...вниман.. БЕГИ... пока мож.. ..опас.. ..тут...
          </strong>
        </figcaption>
      </figure>

      <!-- SVG-фильтр для RGB split (значения согласованы с переменными) -->
      <svg width="0" height="0" style="position:absolute">
        <filter id="rgbSplit">
          <feComponentTransfer in="SourceGraphic" result="r">
            <feFuncR type="identity"/>
            <feFuncG type="table" tableValues="0 0"/>
            <feFuncB type="table" tableValues="0 0"/>
          </feComponentTransfer>
          <feOffset in="r" dx="2" dy="1" result="rShift"/>

          <feComponentTransfer in="SourceGraphic" result="g">
            <feFuncR type="table" tableValues="0 0"/>
            <feFuncG type="identity"/>
            <feFuncB type="table" tableValues="0 0"/>
          </feComponentTransfer>
          <feOffset in="g" dx="-2" dy="0" result="gShift"/>

          <feComponentTransfer in="SourceGraphic" result="b">
            <feFuncR type="table" tableValues="0 0"/>
            <feFuncG type="table" tableValues="0 0"/>
            <feFuncB type="identity"/>
          </feComponentTransfer>
          <feOffset in="b" dx="0" dy="-1" result="bShift"/>

          <feBlend in="gShift" in2="rShift" mode="screen" result="rg"/>
          <feBlend in="rg" in2="bShift" mode="screen"/>
        </filter>
      </svg>
    </div>
  `;

  container.appendChild(el);
}

export function destroy() {
  // Вернуть глобальный блок управления на место при уходе со страницы G
  const controls = document.getElementById('controls');
  if (controls) {
    const prev = controls.dataset.prevDisplay ?? '';
    controls.style.display = prev;
    delete controls.dataset.prevDisplay;
  }
}
