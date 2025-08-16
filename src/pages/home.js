// Стартовая страница Weyland-Yutani с отдельным экраном ввода кода (без Back)
import { navigateByCode, isKnownCode } from '../router.js';
import { CodeInput } from '../components/code-input.js';

export function render(container) {
  // при входе на старт скрываем глобальный блок #controls (если он есть)
  const controls = document.getElementById('controls');
  if (controls) controls.style.display = 'none';

  // основной экран с большой кнопкой START
  container.innerHTML = `
    <section class="start-page">
      <h1 class="logo">Weyland-Yutani Corp</h1>
      <button class="start-button" aria-label="Start system">START</button>
    </section>
  `;

  const startBtn = container.querySelector('.start-button');
  startBtn.addEventListener('click', () => {
    showCodeScreen(container);
  });
}

function showCodeScreen(container) {
  container.innerHTML = `
    <section class="code-screen">
      <h2 class="logo small">ACCESS REQUIRED</h2>
      <div id="inline-code"></div>
    </section>
  `;

  // монтируем компонент ввода кода локально (на отдельном экране)
  const mount = container.querySelector('#inline-code');
  const form = CodeInput({
    onSubmit: (val) => {
      const inputEl = form.querySelector('input');
      const labelEl = form.querySelector('label');

      // если код неизвестен — остаёмся на месте и показываем ACCESS DENIED
      if (!isKnownCode(val)) {
        labelEl.textContent = 'ACCESS DENIED';
        labelEl.classList.add('denied');
        // очистим/выделим ввод для повторного ввода
        inputEl.select?.();
        return;
      }

      // валидный код — возвращаем глобальные controls и уходим на страницу
      const controls = document.getElementById('controls');
      if (controls) controls.style.display = '';
      navigateByCode(val);
    }
  });
  mount.appendChild(form);

  // автофокус в поле ввода
  const inputEl = form.querySelector('input');
  const labelEl = form.querySelector('label');
  const defaultLabel = 'Введите код';

  inputEl?.focus({ preventScroll: true });

  // при любом вводе — снимаем статус ошибки и возвращаем исходный текст
  inputEl?.addEventListener('input', () => {
    if (labelEl.classList.contains('denied')) {
      labelEl.classList.remove('denied');
      labelEl.textContent = defaultLabel;
    }
  });
}
