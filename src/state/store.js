const KEY = 'app:last_code'

export function saveLastCode(code) {
  try { localStorage.setItem(KEY, String(code || '')) } catch (_) {}
}

export function getLastCode() {
  try { return localStorage.getItem(KEY) || '' } catch (_) { return '' }
}
