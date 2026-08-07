/**
 * auth.js
 * ---------------------------------------------------------------
 * Administra por completo la autenticación de la aplicación.
 * No accede a LocalStorage directamente: siempre pasa por storage.js.
 * ---------------------------------------------------------------
 */

import { save, get, remove } from './storage.js';
import { findUserByCredentials } from './users.js';

const SESSION_KEY = 'session';
const LOGIN_PAGE = 'login.html';

/**
 * Intenta iniciar sesión con las credenciales dadas.
 * @param {string} username
 * @param {string} password
 * @returns {{success: boolean, message: string, user?: Object}}
 */
export function login(username, password) {
    if (!username || !password) {
        return { success: false, message: 'Usuario y contraseña son obligatorios.' };
    }

    const user = findUserByCredentials(username.trim(), password);

    if (!user) {
        return { success: false, message: 'Usuario o contraseña incorrectos.' };
    }

    const session = {
        loggedIn: true,
        loginDate: new Date().toISOString(),
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        }
    };

    save(SESSION_KEY, session);

    return { success: true, message: 'Inicio de sesión exitoso.', user: session.user };
}

/**
 * Cierra la sesión activa y redirige al login.
 */
export function logout() {
    remove(SESSION_KEY);
    // replace() evita que el botón "Atrás" regrese a una página protegida.
    window.location.replace(LOGIN_PAGE);
}

/**
 * Debe ejecutarse al cargar cualquier página privada.
 * Si no hay sesión válida, redirige de inmediato al login.
 */
export function checkAuth() {
    if (!isLogged()) {
        window.location.replace(LOGIN_PAGE);
    }
}

/**
 * @returns {{id: number, username: string, name: string}|null}
 */
export function getCurrentUser() {
    const session = get(SESSION_KEY);
    return session && session.user ? session.user : null;
}

/**
 * @returns {boolean} true si existe una sesión activa
 */
export function isLogged() {
    const session = get(SESSION_KEY);
    return !!(session && session.loggedIn === true);
}

/**
 * Devuelve la sesión completa (incluye loginDate), útil para
 * mostrar la fecha/hora de inicio de sesión en el dashboard.
 * @returns {Object|null}
 */
export function getSessionInfo() {
    return get(SESSION_KEY);
}
