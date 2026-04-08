
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

// AI Query
async function sendQuery(query) {
    const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.text;
}

function parseEntryRequests(response) {
    const matches = [...response.matchAll(/ENTRY_REQUEST:\s*(\w+)\/(.+)/g)];
    return matches.map(m => ({ category: m[1], name: m[2].trim() }));
}

function lookupEntries(requests, entries) {
    const results = [];
    for (const req of requests) {
        const items = entries[req.category];
        if (items) {
            const entry = items.find(e => e.name === req.name);
            if (entry) {
                results.push(`[${req.category}] ${entry.name}: ${entry.desc}`);
            }
        }
    }
    return results.length > 0 ? results.join('\n\n') : null;
}

export async function queryAI(query, context, entries, history) {
    const { buildQuery } = await import('./queryBuilder.jsx');
    const finalQuery = buildQuery(query, context, history);
    const responseText = await sendQuery(finalQuery);

    const entryRequests = parseEntryRequests(responseText);
    if (entryRequests.length > 0 && entries) {
        const entryData = lookupEntries(entryRequests, entries);
        if (entryData) {
            const followUpQuery = buildQuery(entryData, '', history, true);
            return await sendQuery(followUpQuery);
        }
    }

    return responseText;
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

// Collaborators
export async function getCollaborators() {
    const res = await fetch('/api/collaborators');
    if (!res.ok) return [];
    const data = await res.json();
    return data.collaborators;
}

export async function addCollaborator(username) {
    const res = await fetch('/api/collaborators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collaborator: username }),
    });
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
    }
    const data = await res.json();
    return data.collaborators;
}

export async function removeCollaborator(username) {
    const res = await fetch(`/api/collaborators/${encodeURIComponent(username)}`, {
        method: 'DELETE',
    });
    const data = await res.json();
    return data.collaborators;
}

// Edit log
export async function fetchEditLog() {
    const res = await fetch('/api/edits');
    if (!res.ok) return [];
    const data = await res.json();
    return data.edits;
}
