import * as redis from 'redis';
import { config } from 'dotenv';
import AppError from './AppError';


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
    try {
      const value = await this.client.get(key);

      return value;
    } catch (error) {
      console.log(error.message);
      throw new AppError(`Redis get error: ${error.message}`);
    }
  }

  async set(key, value, duration) {
  try {
    const result = await this.client.setEx(key, duration, value);

    return result;

  } catch(error) {
    console.log(`error setting key: ${error.message}`);
    throw new AppError(`Redis set error: ${error.message}`);
  }
  }

  async del(key) {
    try {
      const value = await this.client.del(key);

      return value;
    } catch(error) {
      throw new AppError(`Redis del error: ${error.message}`);
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;