import { CodeInput } from './components/code-input.js'
import { initHashNavigation, navigateByCode } from './router.js'
import './styles/base.css'
import './styles/layout.css'

(function mount() {
  const controls = document.getElementById('controls')

  // утилита очистки поля
  const clearInput = () => {
    const field = controls?.querySelector('input')
    if (field) field.value = ''
  }

  // создаём поле ввода; на сабмит — навигация + очистка
  const inputEl = CodeInput({
    onSubmit: (val) => {
      navigateByCode(val)
      clearInput() // сразу очищаем после попытки перехода
    }
  })
  controls.appendChild(inputEl)

  // очищаем при любом переходе по хэшу (валидный код -> новая страница)
  window.addEventListener('hashchange', clearInput)

  // очищаем и при первом рендере
  clearInput()

  // инициализируем навигацию
  initHashNavigation()
})()
