// src/pages/page-a.js — страница A с SVG-схемой вместо картинки
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
          <circle class="s1-line dot-place" cx="53"  cy="36"  r="2.6" />
          <circle class="s1-line dot-way" cx="20"  cy="69"  r="2.6" />
        </svg>
      </div>

      <figcaption>
        <strong>
          Добро пожаловать, администратор.
          Авторизация завершена. Системы корабля <em>USCSS Nostromo</em> работают в штатном режиме.<br>
          Вы находитесь в центральном информационном узле. Доступ к стандартным протоколам открыт.<br><br>
          Для продолжения работы и получения приоритетных инструкций необходимо ввести код доступа к конфиденциальным материалам последнего полевого исследования.<br>
          Обратите внимание: данные помечены как <strong>CLASSIFIED // EYES ONLY</strong>. Несанкционированное раскрытие информации строго запрещено корпоративными директивами Weyland-Yutani.<br><br>
          Система ожидает ваших дальнейших действий.
        </strong>
      </figcaption>
    </figure>
  `;

  container.appendChild(el);
}

export function destroy() {}
