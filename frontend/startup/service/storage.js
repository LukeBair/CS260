const { v4: uuid } = require('uuid');

const users = {};   // { username: { password, worldData } }
const tokens = {};  // { token: username }

const worldDataTemplate = {
  story: [],
  characters: [],
  locations: [],
  props: [],
  history: [],
};

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Auth
function getUser(username) {
  if (!users[username]) return null;
  return { username, ...users[username] };
}

async function createUser(username, password) {
  if (users[username]) return false;
  users[username] = {
    password: await hashPassword(password),
    worldData: { ...worldDataTemplate, story: [], characters: [], locations: [], props: [], history: [] },
  };
  return true;
}

async function verifyPassword(username, password) {
  if (!users[username]) return false;
  return users[username].password === await hashPassword(password);
}

// Tokens
function createToken(username) {
  const token = uuid();
  tokens[token] = username;
  return token;
}

function getUserByToken(token) {
  return tokens[token] || null;
}

function removeToken(token) {
  delete tokens[token];
}

// World data
function getWorldData(username) {
  if (!users[username]) return null;
  return users[username].worldData;
}

function saveWorldData(username, worldData) {
  if (!users[username]) return false;
  users[username].worldData = worldData;
  return true;
}

// Account
function updateAccount(username, updates) {
  if (!users[username]) return false;
  Object.assign(users[username], updates);
  return true;
}

module.exports = {
  worldDataTemplate,
  getUser,
  createUser,
  verifyPassword,
  createToken,
  getUserByToken,
  removeToken,
  getWorldData,
  saveWorldData,
  updateAccount,
};
