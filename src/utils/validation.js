// src/utils/validation.js — валидация 4-значного кода
export function isValidCode(code) {
  return /^\d{4}$/.test(String(code || '').trim());
}
