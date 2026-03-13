const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

const users = {};   // { username: { password, worldData } }
const tokens = {};  // { token: username }

const worldDataTemplate = {
  story: [],
  characters: [],
  locations: [],
  props: [],
  history: [],
};

// Auth
function getUser(username) {
  if (!users[username]) return null;
  return { username, ...users[username] };
}

async function createUser(username, password) {
  if (users[username]) return false;
  users[username] = {
    password: await bcrypt.hash(password, 10),
    worldData: { ...worldDataTemplate, story: [], characters: [], locations: [], props: [], history: [] },
  };
  return true;
}

async function verifyPassword(username, password) {
  if (!users[username]) return false;
  return bcrypt.compare(password, users[username].password);
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

// Collaborators
function getCollaborators(username) {
  if (!users[username]) return [];
  return users[username].collaborators || [];
}

function addCollaborator(username, collaborator) {
  if (!users[username] || !users[collaborator]) return false;
  if (!users[username].collaborators) users[username].collaborators = [];
  if (users[username].collaborators.includes(collaborator)) return false;
  users[username].collaborators.push(collaborator);
  return true;
}

function removeCollaborator(username, collaborator) {
  if (!users[username] || !users[username].collaborators) return false;
  users[username].collaborators = users[username].collaborators.filter(c => c !== collaborator);
  return true;
}

// Get all users connected to this user (their collabs + anyone who added them)
function getConnectedUsers(username) {
  const connected = new Set(getCollaborators(username));
  for (const [name, data] of Object.entries(users)) {
    if (data.collaborators && data.collaborators.includes(username)) {
      connected.add(name);
    }
  }
  return [...connected];
}

// Edit log — stored per-user, shared with collaborators
const editLogs = {}; // { username: [{ user, action, time }] }

function addEditLog(username, action) {
  const entry = { user: username, action, time: new Date().toISOString() };
  // Add to own log and all connected users' logs
  const targets = [username, ...getConnectedUsers(username)];
  for (const target of targets) {
    if (!editLogs[target]) editLogs[target] = [];
    editLogs[target].unshift(entry);
    if (editLogs[target].length > 50) editLogs[target].length = 50;
  }
}

function getEditLog(username) {
  return editLogs[username] || [];
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
  getCollaborators,
  getConnectedUsers,
  addCollaborator,
  removeCollaborator,
  addEditLog,
  getEditLog,
};
