import { ObjectId } from 'mongodb';
import { unlink } from 'fs';
import { v4 } from 'uuid';
import mime from 'mime-types';
import userUtils from '../utils/user';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import AppError from '../utils/AppError';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const FILES_DESTINATION = process.env.FILES_DESTINATION || 'tmp';


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
            userId: ObjectId(user._id.toString()),
            name: file.filename,
            originalName: file.originalname,
            type: 'file',
            isPublic: isPublic || false,
            filePath: file.path,
            size: file.size,
            mimeType: file.mimetype,
            parentId: ObjectId(parentId) || 0,
            createdAt: new Date().toISOString()
        });

        // Return response body data.
        return {
            message: "File uploaded successfully"
        };
    }

    async getIndex(req) {
        const user = await userUtils.getUserBasedOnToken(req);

        if (!user) throw new AppError("Unauthorized", 401);

        const parentId = req.query.parentId || 0;
        const page = req.query.page || 0;
        const limit = req.query.limit || 20;
        const skip = page * limit;

        // Left Join users collection to get file ownership
        const files = await dbClient.filesCollection.aggregate([
            {
                $match: {
                    userId: user._id,
                    // '0' means the root files, files with no parent (folder)
                    parentId: Number(parentId) === 0 ? 0 : ObjectId(parentId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]).toArray();

        console.log(files);

        const fileArray = files.map((file) => ({
            _id: file._id,
            userId: file.userId,
            name: file.name,
            originalName: file.originalName,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId,
            createdAt: file.createdAt,
            owner: file.user[0].email
        }));

        console.log(fileArray);

        return {
            data: fileArray
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