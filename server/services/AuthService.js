import { v4 } from 'uuid';
import sha1 from 'sha1';

import redisClient from '../utils/redis';
import userUtils from '../utils/user';

const unAuthorizedMessage = { error: 'Unauthorized' };

class AuthService {
    /**
     * 
     * @param {Request} req 
     * @returns 
     */
    static async getConnect(req) {
        // Get Auth data (email, password) from the header
        const Authorization = req.header('Authorization').split(' ')[1];

        // Convert from base64 to string (utf-8)
        const decodeAuth = atob(Authorization);

        // Extract email and password from the Auth data.
        const [email, password] = decodeAuth.split(':');

        // If one of them not provided return unauthorization error.
        if (!email || !password) return res.status(401).send(unAuthorizedMessage);

        // Fetch user
        const user = await userUtils.getUser({ email, password: sha1(password) });

        // If user not exist return unauthorization error.
        if (!user) return res.status(401).send(unAuthorizedMessage);

        // Generate token.
        const token = v4();
        const key = `auth_${token}`;

        // Store the token at the redis cache (expiration after 24hrs).
        await redisClient.set(key, user._id.toString(), 24 * 3600);

        // Return response data.
        return { token };
    }

    static async getDisconnect(req) {
        // Fetch user by token.
        const user = await userUtils.getUserBasedOnToken(req);
    
        // Extract the token from the header
        const token = req.header('X-Token');

        // If user not exist
        if (!user) return res.status(401).send(unAuthorizedMessage);

        // Delete the token from redis cache
        await redisClient.del(`auth_${token}`);

        return {};
    }
}

export default AuthService;
