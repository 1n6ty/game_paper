// src/api/index.js
export async function fetchGameHtml() {
    const response = await fetch('https://your-server.com/api/game', {
        method: 'GET',
        // При необходимости можно добавить заголовки, авторизацию и т.п.
    });
    if (!response.ok) {
        throw new Error('Ошибка сети');
    }
    return await response.text();
}
