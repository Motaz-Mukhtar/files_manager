import * as redis from 'redis';
import { config } from 'dotenv';
import { promisify } from 'util';

config();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

class RedisClient {
  constructor () {
    this.client = redis.createClient({
      username: 'default',
      password: REDIS_PASSWORD,
      socket: {
          host: REDIS_HOST,
          port: REDIS_PORT
      }
    });
    this.client.connect();

    this.getAsync = promisify(this.client.get).bind(this.client);
    
    this.client.connected = true;
    
    this.client.on('error', (err) => {
      this.client.connected = false;
      console.log(err.message)
	    console.log(`Redis client not connect to the server: ${err}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  async set(key, value, duration) {
    this.client.setEx(key, duration, value);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;