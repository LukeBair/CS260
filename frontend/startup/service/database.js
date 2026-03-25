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
