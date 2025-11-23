import { ObjectId } from 'mongodb';
import { existsSync, promises, fsPromises, unlink } from 'fs';
import { v4 } from 'uuid';
import mime from 'mime-types';
import userUtils from '../utils/user';
import fileUtils from '../utils/file';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import AppError from '../utils/AppError';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const unAuthorizedMessage = { error: 'Unauthorized' };
const notFoundMessage = { error: 'Not Found' };
const FILES_DESTINATION = process.env.FILES_DESTINATION || 'tmp';

// {
//   fieldname: 'file',
//   originalname: 'Sedga.txt',
//   encoding: '7bit',
//   mimetype: 'text/plain',
//   destination: './uploads',
//   filename: '1763903029461-Sedga.txt',
//   path: 'uploads\\1763903029461-Sedga.txt',
//   size: 423
// }


/**
 * File service class
 */
class FileService {

    /**
     * Function to handle file upload logic.
     * @returns Return response body data.
     */
    async postUpload(requestBody, file, req) {

        // Get user based on token.
        const user = await userUtils.getUserBasedOnToken(req);

        // Get isPublic and parentId from request body.
        const {
            isPublic,
            parentId
        } = requestBody;
    
        // If no file is uploaded.
        if (!file) throw new AppError("No file uploaded", 400)

        // If user is not found, or not authorized
        if (!user) throw new AppError("Unauthorized", 401);
    
        // Insert file data to database.
        await dbClient.filesCollection.insertOne({
            userId: user._id.toString(),
            fileName: file.filename,
            originalName: file.originalname,
            type: 'file',
            isPublic: isPublic || false,
            filePath: file.path,
            size: file.size,
            mimeType: file.mimetype,
            parentId: parentId || 0
        });

        // Return response body data.
        return {
            message: "File uploaded successfully"
        };
    }

    /**
     * Handle file deletion logic.
     * @param {Object} params 
     * @param {Function} header 
     * @returns 
     */
    async deleteFile(params, req) {
        const fileId = params.id;
        const token = req.header('X-Token');

        // Get userfrom redis based on token.
        const userId = await redisClient.get(`auth_${token}`);

        // Get file from database based on id.
        const file = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });

        // If user is not found or authorized
        // Or if the user try to delete a file that does not belong to him
        if (!userId || userId !== file.userId)
            throw new AppError("Unauthorized", 401);

        // If file is not found.
        if (!file)
            throw new AppError("File not found", 404);

        // Delete file from local storage
        console.log(file.path)
        console.log(file);
        unlink(`${FILES_DESTINATION}/${file.fileName}`, (error) => {
            if (error)
                console.log(error, error.message)
        })

        // Delete file data from the database.
        await dbClient.filesCollection.deleteOne({ _id: ObjectId(fileId) });

        // Return no content.
        return {};
    }

    /**
     * Handle file download logic.
     * @param {Request} req 
     * @param {Response} res 
     * @returns 
     */
    async downloadFile(req, res) {
        const fileId = req.params.fileId;
        const file = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });

        if (!file || file.isPublic === false) 
            throw new AppError("File not found", 404);

        const mimeType = mime.contentType(file.originalName);

        res.setHeader('Content-Type', mimeType);

        res.download(`${FILES_DESTINATION}/${file.fileName}`, (error) => {
            if (error)
                throw new AppError("Failed to download file", 500);
        })

    }
}

export default new FileService();