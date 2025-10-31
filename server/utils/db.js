import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const DB_HOST = process.env.DB_HOST || '0.0.0.0';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;
const DB_URL = process.env.DB_URL || url;

class DBClient {
  constructor() {
    this.connected = false;
	  console.log(DB_URL)
    MongoClient.connect(DB_URL, { useUnifiedTopology: true }, (err, client) => {

      if (!err) {
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
        this.connected = true;
      }
    });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    const users = this.usersCollection.countDocuments();
    return users;
  }

  async nbFiles() {
    const files = this.filesCollection.countDocuments();
    return files;
  }
}

const dbClient = new DBClient();

export default dbClient;
