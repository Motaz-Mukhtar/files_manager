import AppError from '../utils/AppError';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

/**
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
async function verifyToken(req, res, next) {

    try {
        const user = await userUtils.getUserBasedOnToken(req);

        if (!user) throw new AppError("Unauthorized", 401);

        req.user = user;
        next();
    } catch (error) {
        // Pass error to the next middleware
        next(error);
    }
}

export default verifyToken;