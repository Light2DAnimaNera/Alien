// src/router.js — маршрутизация по кодам + единый lifecycle (очистка ресурсов перед переходом)

/**
 * Таблица маршрутов (как в архиве).
 * При необходимости дополни своими кодами/страницами.
 */
const routes = {
  '0000': () => import('./pages/home.js'),
  '4832': () => import('./pages/page-a.js'),
  '7159': () => import('./pages/page-b.js'),
  '2467': () => import('./pages/page-c.js'), // Страница C
  '5921': () => import('./pages/page-d.js'),
  '8043': () => import('./pages/page-e.js'),
  '1785': () => import('./pages/page-f.js'),
  '9364': () => import('./pages/page-g.js'),
}

// Контейнер приложения (как в архиве)
const APP_ROOT_ID = 'app-content'

/** Проверка существования кода (нужно для логики "ACCESS DENIED" в app.js) */
export function isKnownCode(code) {
  const key = String(code ?? '').trim()
  return Object.prototype.hasOwnProperty.call(routes, key)
}

/** Текущая функция очистки страницы (если страница её предоставила) */
let currentCleanup = null

/** Вызов пользовательской очистки (если есть) + страховочная остановка аудио */
async function runCleanup() {
  if (typeof currentCleanup === 'function') {
    try {
      await currentCleanup()
    } catch (e) {
      console.warn('[router] cleanup error:', e)
    } finally {
      currentCleanup = null
    }
  }

  // Страховка: погасим любые <audio> в контейнере, чтобы исключить наложения
  const root = document.getElementById(APP_ROOT_ID)
  if (root) {
    const audios = root.querySelectorAll('audio')
    audios.forEach((a) => {
      try {
        a.pause?.()
        a.currentTime = 0
        a.src = ''     // разрываем источник
        a.load?.()
        a.remove?.()   // убираем из DOM
      } catch {}
    })
  }
}

/** Навигация по коду (меняет hash, что триггерит отрисовку) */
export function navigateByCode(code) {
  const key = String(code ?? '').trim()
  if (!isKnownCode(key)) return
  if (location.hash !== `#${key}`) {
    location.hash = key
  } else {
    // повторный переход на тот же код — перерисуем с очисткой
    loadCurrent().catch((e) => {
      console.error(e)
      navigateHome()
    })
  }
}

/** Переход на домашнюю страницу */
function navigateHome() {
  location.hash = '#0000'
}

/** Вытаскиваем функцию очистки из возвращаемого значения и/или модуля страницы */
function extractCleanup(mod, ret) {
  // приоритет: возвращённая из render функция → ret.cleanup → экспортируемые destroy/cleanup/unmount
  if (typeof ret === 'function') return ret
  if (ret && typeof ret.cleanup === 'function') return ret.cleanup

  // поддержка имен из архива и наших фиксов
  if (typeof mod.destroy === 'function') return mod.destroy
  if (typeof mod.cleanup === 'function') return mod.cleanup
  if (typeof mod.unmount === 'function') return mod.unmount

  return null
}

/** Загрузка и рендер текущей страницы по hash */
async function loadCurrent() {
  const key = location.hash.replace('#', '')
  const root = document.getElementById(APP_ROOT_ID)
  if (!root) return

  // 1) всегда сначала чистим предыдущую страницу/ресурсы
  await runCleanup()

  try {
    // 2) грузим модуль страницы
    const loader = routes[key] || routes['0000']
    const mod = await loader()

    // 3) очищаем контейнер и рендерим
    root.innerHTML = ''

    // Совместимость: страница может экспортировать render или default (функцию)
    const renderFn = typeof mod.render === 'function' ? mod.render
                    : typeof mod.default === 'function' ? mod.default
                    : null
    if (!renderFn) {
      throw new Error(`[router] page module for code ${key} has no render() or default export`)
    }

    const ret = await renderFn(root)

    // 4) сохраняем функцию очистки (если предоставлена)
    currentCleanup = extractCleanup(mod, ret)
  } catch (e) {
    console.error('[router] failed to load page for code:', key, e)
    navigateHome()
  }
}

/** Инициализация слушателей и первого рендера */
export function initHashNavigation() {
  // навигация по изменению hash
  window.addEventListener('hashchange', () => {
    const key = location.hash.replace('#', '')
    if (isKnownCode(key)) {
      loadCurrent().catch((e) => {
        console.error(e)
        navigateHome()
      })
    } else {
      navigateHome()
    }
  })

  // корректная очистка при закрытии вкладки/перезагрузке
  window.addEventListener('beforeunload', () => {
    try { currentCleanup?.() } catch {}
  })

  // первый рендер
  const initial = location.hash.replace('#', '')
  if (isKnownCode(initial)) {
    loadCurrent().catch((e) => {
      console.error(e)
      navigateHome()
    })
  } else {
    navigateHome()
  }
}
