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

  /**
   * Get value from redis based on key
   * @param {string} key 
   */
  async get(key) {
    // await new Promise((resolve, reject) => {
    //   this.client.get(key, (err, reply) => {
    //     if (err) reject(err);

    //     else resolve(reply)
    //   });
    // });
    const value = await this.client.get(key);

    return value;
  }

  /**
   * Store key value pair in redis with expiration duration
   * @param {string} key - key value
   * @param {string} value - value to be stored
   * @param {number} duration - duration in seconds 
   */
  async set(key, value, duration) {
    // await new Promise((resolve, reject) => {
    //   this.client.setEx(key, duration, value, (err, reply) => {
    //     if (err) reject(err);

    //     else resolve(reply);
    //   });
    // });
    await this.client.setEx(key, duration, value);
  }

  /**
   * Delete a key from redis
   * @param {string} key 
   */
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;