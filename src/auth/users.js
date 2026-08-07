/**
 * users.js
 * ---------------------------------------------------------------
 * Fuente de verdad de los usuarios de la aplicación.
 * Si LocalStorage no tiene usuarios todavía, se inicializan aquí
 * automáticamente con un set de usuarios por defecto.
 * ---------------------------------------------------------------
 */

import { save, get } from './storage.js';

const USERS_KEY = 'users';

const DEFAULT_USERS = [
    { id: 1, username: 'admin', password: '123456', name: 'Administrador', role: 'admin' },
    { id: 2, username: 'operador', password: '123456', name: 'Operador', role: 'operator' }
];

/**
 * Crea el set inicial de usuarios en LocalStorage si aún no existe.
 */
function initUsers() {
    const existing = get(USERS_KEY);
    if (!Array.isArray(existing) || existing.length === 0) {
        save(USERS_KEY, DEFAULT_USERS);
    } else {
        const normalized = existing.map((user, index) => ({ ...user, role: user.role || (index === 0 ? 'admin' : 'operator') }));
        if (!normalized.some((user) => user.username === 'operador')) normalized.push(DEFAULT_USERS[1]);
        save(USERS_KEY, normalized);
    }
}

/**
 * Devuelve la lista completa de usuarios registrados.
 * @returns {Array<Object>}
 */
export function getUsers() {
    initUsers();
    return get(USERS_KEY);
}

/**
 * Busca un usuario que coincida exactamente con usuario y contraseña.
 * @param {string} username
 * @param {string} password
 * @returns {Object|null}
 */
export function findUserByCredentials(username, password) {
    const users = getUsers();
    return (
        users.find((u) => u.username === username && u.password === password) ||
        null
    );
}

/**
 * Agrega un nuevo usuario al set existente.
 * Pensado para uso futuro (ej. panel de administración de usuarios).
 * @param {{username: string, password: string, name: string}} newUser
 * @returns {Object} el usuario creado, con su id asignado
 */
export function addUser(newUser) {
    const users = getUsers();
    const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    const userToStore = { id: nextId, ...newUser };
    save(USERS_KEY, [...users, userToStore]);
    return userToStore;
}
