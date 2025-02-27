// src/api/index.js

const baseUrl = "https://octopus-outgoing-bee.ngrok-free.app/";

export async function fetchGameHtml() {
    const response = await fetch(baseUrl + 'api/game', {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Ошибка сети');
    }
    return await response.text();
}

export async function fetchPoints() {
    const response = await fetch(baseUrl + 'api/game', {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Ошибка сети');
    }
    return await response.text();
}
