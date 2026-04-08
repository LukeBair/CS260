let socket = null;
let reconnectTimeout = null;
let currentUsername = null;
let editCallback = null;
let worldCallback = null;
let pendingEdit = null;
let pendingCount = 0;
let flushTimer = null;
const BATCH_DELAY = 500;

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
                const edit = msg.edit;
                if (pendingEdit && pendingEdit.action === edit.action && pendingEdit.username === edit.username) {
                    pendingCount++;
                } else {
                    flushPendingEdit();
                    pendingEdit = edit;
                    pendingCount = 1;
                }
                clearTimeout(flushTimer);
                flushTimer = setTimeout(flushPendingEdit, BATCH_DELAY);
            } else if (msg.type === 'worldUpdate' && worldCallback) {
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

function flushPendingEdit() {
    if (!pendingEdit || !editCallback) return;
    const edit = pendingCount > 1
        ? { ...pendingEdit, action: `${pendingEdit.action} (x${pendingCount})` }
        : pendingEdit;
    editCallback(edit);
    pendingEdit = null;
    pendingCount = 0;
    clearTimeout(flushTimer);
}

export function disconnectWebSocket() {
    flushPendingEdit();
    currentUsername = null;
    editCallback = null;
    worldCallback = null;
    clearTimeout(reconnectTimeout);
    if (socket) {
        socket.close();
        socket = null;
    }
}