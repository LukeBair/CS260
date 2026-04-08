let socket = null;
let reconnectTimeout = null;
let currentUsername = null;
let editCallback = null;
let worldCallback = null;

export function connectWebSocket(username, onEditNotification, onWorldUpdated) {
    currentUsername = username;
    editCallback = onEditNotification;
    worldCallback = onWorldUpdated;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'; // locally will be ws, prod is wss
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'identify', username }));
    };

    socket.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'editNotification' && editCallback) {
                editCallback(msg.edit);
            } else if (msg.type === 'worldUpdated' && worldCallback) {
                worldCallback();
            }
        } catch (e) {
            console.error('WebSocket message parse error', e);
        }
    };

    socket.onclose = () => {
        if (currentUsername) {
            reconnectTimeout = setTimeout(() => {
                connectWebSocket(currentUsername, editCallback, worldCallback);
            }, 3000);
        }
    };
}

export function disconnectWebSocket() {
    currentUsername = null;
    editCallback = null;
    worldCallback = null;
    clearTimeout(reconnectTimeout);
    if (socket) {
        socket.close();
        socket = null;
    }
}