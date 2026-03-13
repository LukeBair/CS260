
// Auth
export async function login(username, password) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('currentUser', data.username);
    return true;
}

export async function createAccount(username, password) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('currentUser', data.username);
    return true;
}

export async function logout() {
    await fetch('/api/auth/logout', { method: 'DELETE' });
    localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// World data
export async function loadUserStoryData() {
    const res = await fetch('/api/world');
    if (!res.ok) return null;
    return res.json();
}

export async function saveUserStoryData(worldData) {
    const res = await fetch('/api/world', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worldData),
    });
    return res.ok;
}

// AI Search
export async function naturalLanguageSearch(query) {
    const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.text;
}

// Account Management
export async function saveAccountChanges(updates) {
    const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return res.ok;
}