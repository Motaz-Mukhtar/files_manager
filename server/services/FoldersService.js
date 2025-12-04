import dbClient from '../utils/db';
import AppError from '../utils/AppError';
import { ObjectId } from 'mongodb';


class FoldersService {
    /**
     * Retrieve all files that are stored inside the folder
     * by folder id
     * @param {Object} reqParams  - Request parameters
     * @param {Object} reqQuery - Request query parameters
     * @param {string} currentUserId - Current logged in user id
     */
    static async getFolderFiles(reqParams, reqQuery, currentUserId) {
        const {
            folderId
        } = reqParams;

        // Validate incoming data
        if (typeof folderId !== 'string' || folderId.trim().length === 0)
            throw new AppError("Folder id is not valid", 400);


        // Pagination parameters
        const page = reqQuery.page || 0;
        // In case the limit is more than 20, set it to 20
        const limit = reqQuery.limit > 20 ? 20 : reqQuery.limit || 20;
        const skip = page * limit;

        // Retrieve files from the database by folder id and user id
        // to ensure user can only access their own files.
        const files = await dbClient.filesCollection.find({
            parentId: folderId,
            userId: currentUserId 
        }).skip(skip).limit(limit).toArray();

        // Get folder name
        const { name } = await dbClient.filesCollection.findOne({ _id: ObjectId(folderId) });

        // In case no files found in the folder, throw not found error
        if (files.length <= 0) 
            throw new AppError("Folder is empty" , 404, {
                folderName: name
            });

        // Return response body data.
        return {
            message: "Folder files retrieved successfully",
            data: files,
            folderName: name
        };
    }

    /**
     * Handle folder creation logic
     * @param {Object} requestBody 
     */
    static async newFolder(requestBody, userData) {
        const {
            folderName,
            isPublic,
            parentId
        } = requestBody;

        // Validate incoming data
        if (
            typeof folderName !== 'string' ||
            folderName.trim().length >= 26 ||
            folderName.trim().length <= 0
        )
            throw new AppError("Folder name is not valid", 400);

        console.log("Hello world")
        let l = await dbClient.filesCollection.insertOne({
            name: folderName,
            type: 'folder',
            isPublic: isPublic || false,
            parentId: parentId || 0,
            userId: userData._id.toString(),
            createdAt: new Date().toISOString()
        });
        console.log(l);
        return {
            message: "Folder created "
        };
    }

    /**
     * 
     * @param {Object} reqParams - Request parameters
     * @param {String} currentUserId - Current logged in user id 
     */
    static async deleteFolder(reqParams, currentUserId) {
        const {
            folderId
        } = reqParams;
        console.log(folderId)
        // Validate incoming data
        if (typeof folderId !== 'string' || folderId.trim().length === 0)
            throw new AppError("Folder id is not valid", 400);

        // Delete folder from the database
        // Ensure that the folder belongs to the current user

        const deleteResult = await dbClient.filesCollection.deleteOne({
            _id: ObjectId(folderId),
            userId: currentUserId
        });

        console.log(folderId)
        console.log(currentUserId);
        // Delete all files insdie the folder
        await dbClient.filesCollection.deleteMany({
            parentId: folderId,
            userId: currentUserId
        });

        // In case no folder was deleted, throw not found error
        if (deleteResult.deletedCount === 0)
            throw new AppError("Folder not found", 404);

        // Return response body data.
        return {
            message: "Folder deleted successfully"
        };
    }
}

export default FoldersService;