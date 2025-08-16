// src/app.js — единое поведение ввода кода, как на home, для всех страниц

import { CodeInput } from './components/code-input.js'
import { initHashNavigation, navigateByCode, isKnownCode } from './router.js'

// ваши стили (оставьте как есть)
import './styles/base.css'
import './styles/layout.css'
// новый файл стилей для ACCESS DENIED (см. ниже)
import './styles/access-denied.css'

;(function mount() {
  const controls = document.getElementById('controls')

  // утилита очистки поля в хедере/контролах
  const clearInput = () => {
    const field = controls?.querySelector('input')
    if (field) field.value = ''
  }

  // создаём поле ввода; логика полностью как на home:
  //  - невалидный/неизвестный код → ACCESS DENIED, остаёмся на месте, выделяем ввод
  //  - валидный код → навигация и очистка поля
  const formEl = CodeInput({
    onSubmit: (val) => {
      const form = controls?.querySelector('.code-input') || formEl
      const input = form?.querySelector('input')
      const label = form?.querySelector('label')
      const defaultLabel = 'Введите код'

      const code = String(val ?? '').trim()

      if (!isKnownCode(code)) {
        if (label) {
          label.textContent = 'ACCESS DENIED'
          label.classList.add('denied')
        }
        input?.focus?.({ preventScroll: true })
        input?.select?.()
        return
      }

      navigateByCode(code)
      clearInput()
      // на всякий — вернуть дефолтный текст, если был режим denied
      if (label?.classList.contains('denied')) {
        label.classList.remove('denied')
        label.textContent = defaultLabel
      }
    },
  })

  // сброс «ACCESS DENIED» при любом последующем вводе символа
  ;(() => {
    const input = formEl.querySelector('input')
    const label = formEl.querySelector('label')
    const defaultLabel = 'Введите код'
    input?.addEventListener('input', () => {
      if (label?.classList.contains('denied')) {
        label.classList.remove('denied')
        label.textContent = defaultLabel
      }
    })
  })()

  // монтируем контролы
  controls?.appendChild(formEl)

  // чистим поле при успешной навигации (смена hash)
  window.addEventListener('hashchange', clearInput)

  // первичная очистка
  clearInput()

  // запускаем маршрутизацию
  initHashNavigation()
})()
