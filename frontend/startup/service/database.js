const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('mythril');
const userCollection = db.collection('users');
const editLogCollection = db.collection('editLogs');

(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log('Connected to database');
    } catch (ex) {
        console.log(`Unable to connect to database: ${ex.message}`);
        process.exit(1);
    }
})();

// Auth
async function createUser(username, password) {
    const existing = await userCollection.findOne({ username });
    if (existing) return false;
    await userCollection.insertOne({
        username,
        password: await bcrypt.hash(password, 10),
        worldData: { story: [], characters: [], locations: [], props: [], history: [] },
        collaborators: [],
    });
    return true;
}

async function verifyPassword(username, password) {
    const user = await userCollection.findOne({ username });
    if (!user) return false;
    return bcrypt.compare(password, user.password);
}

// Tokens
function createToken(username) {
    const token = uuid();
    userCollection.updateOne({ username }, { $set: { token } });
    return token;
}

function getUserByToken(token) {
    return userCollection.findOne({ token }).then(user => user ? user.username : null);
}

async function removeToken(token) {
    await userCollection.updateOne({ token }, { $unset: { token: 1 } });
}

// World data
async function getWorldData(username) {
    const user = await userCollection.findOne({ username });
    return user ? user.worldData : null;
}

async function saveWorldData(username, worldData) {
    const result = await userCollection.updateOne({ username }, { $set: { worldData } });
    return result.modifiedCount > 0;
}

// Account
async function updateAccount(username, updates) {
    const result = await userCollection.updateOne({ username }, { $set: updates });
    return result.modifiedCount > 0;
}

// Collaborators
async function getCollaborators(username) {
    const user = await userCollection.findOne({ username });
    return user ? user.collaborators || [] : [];
}

async function addCollaborator(username, collaborator) {
    const result = await userCollection.updateOne(
        { username },
        { $addToSet: { collaborators: collaborator } }
    );
    return result.modifiedCount > 0;
}

async function removeCollaborator(username, collaborator) {
    const result = await userCollection.updateOne(
        { username },
        { $pull: { collaborators: collaborator } }
    );
    return result.modifiedCount > 0;
}

async function getConnectedUsers(username) {
    const collaborators = await getCollaborators(username);
}

// Edit log
async function addEditLog(username, action) {
    // TODO
}

async function getEditLog(username) {
    // TODO
}

module.exports = {
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