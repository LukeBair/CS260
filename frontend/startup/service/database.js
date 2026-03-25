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