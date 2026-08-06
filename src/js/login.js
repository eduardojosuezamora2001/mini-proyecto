/**
 * login.js
 * ---------------------------------------------------------------
 * Responsable únicamente de la interfaz del login:
 *  - Leer el formulario
 *  - Validar campos vacíos
 *  - Invocar login() de auth.js
 *  - Mostrar mensajes de error
 *  - Redireccionar al dashboard si el login es exitoso
 * Toda la lógica de autenticación vive en auth/auth.js.
 * ---------------------------------------------------------------
 */

import { login, isLogged } from '../auth/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Si ya hay una sesión activa, no tiene sentido mostrar el login.
    if (isLogged()) {
        window.location.replace('dashboard.html');
        return;
    }

    const form = document.getElementById('login-form');
    const errorBox = document.getElementById('login-error');
    const errorText = document.getElementById('login-error-text');
    const usernameInput = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-password');

    form.addEventListener('submit', handleSubmit);
    toggleBtn.addEventListener('click', togglePasswordVisibility);

    function handleSubmit(event) {
        event.preventDefault();
        hideError();

        const username = usernameInput.value.trim();
        const password = passwordField.value;

        if (!username || !password) {
            showError('Por favor completa todos los campos.');
            return;
        }

        const result = login(username, password);

        if (result.success) {
            window.location.replace('dashboard.html');
        } else {
            showError(result.message);
        }
    }

    function togglePasswordVisibility() {
        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
        toggleBtn.classList.toggle('is-visible', isPassword);
    }

    function showError(message) {
        errorText.textContent = message;
        errorBox.hidden = false;
        passwordField.closest('.input-group').classList.add('input-error');
    }

    function hideError() {
        errorBox.hidden = true;
        passwordField.closest('.input-group').classList.remove('input-error');
    }
});