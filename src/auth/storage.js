/**
 * storage.js
 * ---------------------------------------------------------------
 * Único módulo autorizado para tocar LocalStorage directamente.
 * El resto del sistema (auth.js, users.js, etc.) siempre pasa
 * por estas funciones, nunca por localStorage.setItem/getItem.
 * ---------------------------------------------------------------
 */

const PREFIX = 'kinetic_';

/**
 * Guarda un valor en LocalStorage (se serializa a JSON).
 * @param {string} key
 * @param {*} value
 * @returns {boolean} true si se guardó correctamente
 */
export function save(key, value) {
    try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('[storage.js] Error al guardar:', error);
        return false;
    }
}

/**
 * Obtiene un valor de LocalStorage (se deserializa desde JSON).
 * @param {string} key
 * @returns {*} el valor guardado, o null si no existe
 */
export function get(key) {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('[storage.js] Error al leer:', error);
        return null;
    }
}

/**
 * Elimina una clave específica de LocalStorage.
 * @param {string} key
 */
export function remove(key) {
    localStorage.removeItem(PREFIX + key);
}

/**
 * Elimina todas las claves que pertenecen a esta aplicación
 * (identificadas por el PREFIX), sin tocar otras claves ajenas.
 */
export function clear() {
    Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
}