import { dbCreateUser, dbVerifyPassword, dbGetWorldData, dbSaveWorldData, dbUpdateAccount } from "../storage/storageDummy";

// Auth
export async function login(username, password) {
    const valid = await dbVerifyPassword(username, password);
    if (!valid) return false;
    localStorage.setItem('currentUser', username);
    return true;
}

export async function createAccount(username, password) {
    const success = await dbCreateUser(username, password);
    if (!success) return false;
    localStorage.setItem('currentUser', username);
    return true;
}

export function logout() {
    localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

// World data
export function loadUserStoryData() {
    const username = getCurrentUser();
    if (!username) return null;
    return dbGetWorldData(username);
}

export function saveUserStoryData(worldData) {
    const username = getCurrentUser();
    if (!username) return false;
    return dbSaveWorldData(username, worldData);
}

// Account
export function saveAccountChanges(updates) {
    const username = getCurrentUser();
    if (!username) return false;
    return dbUpdateAccount(username, updates);
}
