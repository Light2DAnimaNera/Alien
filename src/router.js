// src/router.js — маршрутизация по 4-значным кодам
const routes = {
  // Код для возврата на домашнюю
  '0000': () => import('./pages/home.js'),

  // Рабочие коды → страницы
  '4832': () => import('./pages/page-a.js'),
  '7159': () => import('./pages/page-b.js'),
  '2467': () => import('./pages/page-c.js'),
  '5921': () => import('./pages/page-d.js'),
  '8043': () => import('./pages/page-e.js'),
  '1785': () => import('./pages/page-f.js'),
  '9364': () => import('./pages/page-g.js'),
};

// ---- ВСТАВЛЕНО: проверка существования кода
export function isKnownCode(code) {
  const key = String(code || '').trim();
  return Object.prototype.hasOwnProperty.call(routes, key);
}

let current = { mod: null };

export async function navigateByCode(code) {
  const key = String(code || '').trim();
  const loader = routes[key];
  const app = document.getElementById('app-content');

  if (!loader) {
    // Неизвестный код — пусть обработка остаётся на экране ввода (см. home.js).
    // Здесь просто покажем сообщение в контенте, если кто-то дернул напрямую.
    app.innerHTML = '<p role="status">Неверный код.</p>';
    return;
  }

  if (current.mod && typeof current.mod.destroy === 'function') {
    try { current.mod.destroy(); } catch {}
  }

  try {
    const mod = await loader();
    app.innerHTML = '';
    await mod.render(app);
    current.mod = mod;
    // синхронизируем адресную строку
    location.hash = '#' + key;
  } catch (err) {
    console.error(err);
    app.innerHTML = '<p role="alert">Ошибка загрузки страницы.</p>';
  }
}

export function navigateHome() {
  const app = document.getElementById('app-content');
  import('./pages/home.js').then((mod) => {
    app.innerHTML = '';
    mod.render(app);
    current.mod = mod;
    // очищаем хэш, чтобы домашняя была без кода
    history.replaceState(null, '', location.pathname);
  });
}

export function initHashNavigation() {
  window.addEventListener('hashchange', () => {
    const key = location.hash.replace('#', '');
    if (key && routes[key]) {
      navigateByCode(key);
    } else {
      navigateHome();
    }
  });

  // Первый рендер
  const initial = location.hash.replace('#', '');
  if (initial && routes[initial]) {
    navigateByCode(initial);
  } else {
    navigateHome();
  }
}
