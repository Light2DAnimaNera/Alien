// src/pages/page-d.js — SVG-схема вместо картинки, текст сохранён
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
                   data-name="Комната проходная"
                   points="
                     30,44  42,44  42,61  53,61  53,79
                     27,79  27,118 49,118 49,136 11,136
                     11,61  30,61" />
          <polygon class="s1-line s2-default"
                   data-name="Шлюзовая комната"
                   points="
                     49,118  130,118  130,89  157,89 157,136  49,136" />
          <polygon class="s1-line s2-default"
                   data-name="Комната управления"
                   points="49,99 88,99 88,118 49,118" />
          <polygon class="s1-line s3-active"
                   data-name="Склад"
                   points="101,107 115,107 115,118 101,118" />

          <!-- Точки (радиус задаётся стилями: var(--dot-r)) -->
          <circle class="s1-line dot-place" cx="59"  cy="110" r="2.6" />
          <circle class="s1-line dot-way" cx="108" cy="112" r="2.6" />
        </svg>
      </div>

      <figcaption>
        <strong>
          Вы находитесь в рубке управления корабля <em>Nostromo</em>. Атмосферные параметры в данном секторе стабильны. Повреждённые отсеки успешно отстыкованы. Ваша жизнь в настоящий момент вне непосредственной угрозы.<br><br>
          В соответствии с протоколами Weyland-Yutani, вашей задачей объявлено любой ценой сохранить обнаруженные образцы...<br><br>
          <em>— Ольга, это Бишоп.</em> Я оставил эту запись на случай, если меня уже нет в живых. Желание корпорации сохранить эти образцы — ошибка. Во что бы то ни стало, тебе необходимо взять заряд взрывчатки, выйти в открытый космос и положить конец этому безумию.<br><br>
          Помни: если мы не уничтожим их сейчас, следующий шанс может уже не представиться.
        </strong>
      </figcaption>
    </figure>
  `;
  container.appendChild(el);
}
export function destroy() {}
