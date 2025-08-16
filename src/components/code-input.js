// src/components/code-input.js — поле ввода ровно 4 цифр, без placeholder, с отступами
export function CodeInput({ onSubmit }) {
  const form = document.createElement('form');
  form.className = 'code-input';

  // делаем вертикальное расположение с отступами
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.alignItems = 'center';
  form.style.gap = '10px'; // отступы между элементами

  const label = document.createElement('label');
  label.textContent = 'Введите код';
  label.setAttribute('for', 'code-input');

  const input = document.createElement('input');
  input.id = 'code-input';
  input.type = 'text';
  input.autocomplete = 'one-time-code';
  input.inputMode = 'numeric';
  input.required = true;
  input.pattern = '\\d{4}';

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Перейти';

  form.append(label, input, btn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (input.value || '').trim();
    if (!/^\d{4}$/.test(val)) {
      input.reportValidity?.();
      return;
    }
    onSubmit?.(val);
  });

  return form;
}
