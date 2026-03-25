const { Mongo } = require('mongodb')
const bcrypt = require('bcrypt')
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

// User stuff

async function createUser(username, password) {
    // Check if user already exists
    const existing = await userCollection.findOne({ username });
    if (existing) return false;

    // Insert new user document
    await userCollection.insertOne({
        username,
        password: await bcrypt.hash(password, 10),
        worldData: { story: [], characters: [], locations: [], props: [], history: [] },
        collaborators: [],
    });
    return true;
}

async function getUser(username) {
    const user = await userCollection.findOne({ username });
    if (!user) return null;
    return { username: user.username, ...user };
}

async function verifyPassword(username, password) {
    const user = await getUser(username);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
}