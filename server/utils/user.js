import { ObjectId } from 'mongodb';
import redisClient from './redis';
import dbClient from './db';

class userUtils {
  static async getUserBasedOnToken(request) {
    console.log("fetching token")
    const Xtoken = request.header('X-Token');
    console.log("Fetched token")
    if (!Xtoken) return undefined;

    const key = `auth_${Xtoken}`;
    console.log("Get key")
    const userId = await redisClient.get(key);
    console.log("fetched token from redis");
    if (!userId) return undefined;

    const user = await dbClient.usersCollection.findOne({ _id: ObjectId(userId) });
    console.log('fetched user from mongodb')
    if (!user) return undefined;

    return user;
  }

  static async getUser(query) {
    console.log(dbClient.usersCollection)
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  }
}

export default userUtils;
