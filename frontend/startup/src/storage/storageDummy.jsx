export const worldDataTemplate = {
    story: [],
    characters: [],
    locations: [],
    props: [],
    history: [],
};

// localstorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

async function hashPassword(password) {
    const encoded = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// database mock
// Auth
export function dbGetUser(username) {
    const users = getUsers();
    if (!users[username]) return null;
    return { username, ...users[username] };
}

export async function dbCreateUser(username, password) {
    const users = getUsers();
    if (users[username]) return false;
    users[username] = {
        password: await hashPassword(password),
        worldData: { ...worldDataTemplate },
    };
    saveUsers(users);
    return true;
}

export async function dbVerifyPassword(username, password) {
    const users = getUsers();
    if (!users[username]) return false;
    return users[username].password === await hashPassword(password);
}

// World data
export function dbGetWorldData(username) {
    const users = getUsers();
    if (!users[username]) return null;
    return users[username].worldData;
}

export function dbSaveWorldData(username, worldData) {
    const users = getUsers();
    if (!users[username]) return false;
    users[username].worldData = worldData;
    saveUsers(users);
    return true;
}

export function dbUpdateEntry(username, section, entryIndex, updatedEntry) {
    const users = getUsers();
    if (!users[username]?.worldData?.[section]?.[entryIndex]) return false; // bunch of null checks
    users[username].worldData[section][entryIndex] = updatedEntry;
    saveUsers(users);
    return true;
}

export function dbAddEntry(username, section, newEntry) {
    const users = getUsers();
    if (!users[username]?.worldData?.[section]) return false;
    users[username].worldData[section].push(newEntry);
    saveUsers(users);
    return true;
}

export function dbDeleteEntry(username, section, entryIndex) {
    const users = getUsers();
    if (!users[username]?.worldData?.[section]?.[entryIndex]) return false;
    users[username].worldData[section].splice(entryIndex, 1);
    saveUsers(users);
    return true;
}

// Account
export function dbUpdateAccount(username, updates) {
    const users = getUsers();
    if (!users[username]) return false;
    Object.assign(users[username], updates);
    saveUsers(users);
    return true;
}
