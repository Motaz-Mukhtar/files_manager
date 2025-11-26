import AppError from '../utils/AppError';
import redisClient from '../utils/redis';


/**
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {import('express').NextFunction} next
 */
function verifyToken(req, res, next) {
    try {

    } catch (error) {
        // Pass error to the next middleware
        next(error);
    }
}

export default verifyToken;