import { ObjectId } from 'mongodb';
import { existsSync, promises, fsPromises, unlink } from 'fs';
import { v4 } from 'uuid';
import mime from 'mime-types';
import userUtils from '../utils/user';
import fileUtils from '../utils/file';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import FileService from '../services/FilesService';
import FilesService from '../services/FilesService';

const unAuthorizedMessage = { error: 'Unauthorized' };
const notFoundMessage = { error: 'Not Found' };
const FOLDER_PATH = process.env.FOLDER_PATH || 'tmp';

class FilesController {

  /**
   * File upload function
   * @param {Reqest} req 
   * @param {Response} res 
   * @param {import('express').NextFunction} next 
   * @returns
   */
  static async postUpload(req, res, next) {
    try {
      const result = await FileService.postUpload(req.body, req.file, req);

      return res.status(201).json({
        statusCode: 201,
        data: result
      });

    } catch(error) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  // Retrieve file based on id.
  static async getShow(req, res) {
    const user = await userUtils.getUserBasedOnToken(req);

    if (!user) return res.status(401).send(unAuthorizedMessage);
    const file = await dbClient.filesCollection.findOne({_id: ObjectId(req.params.id)})
    
    if (!file) return res.status(404).send(notFoundMessage);

    return res.status(200).send(file);
  }

  /**
   * Get files root
   * @param {Request} req 
   * @param {Response} res 
   * @param {import('express').NextFunction} next 
   * @returns 
   */
  static async getIndex(req, res, next) {
    try {
      // Pass the request to the file service.
      const result = await FilesService.getIndex(req);

      return res.status(200).json({
        statusCode: 200,
        ...result
      });
    } catch(error) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  static async putPublish(req, res) {
    const user = await userUtils.getUserBasedOnToken(req);
    const fileId = req.params.id;

    if (!user) return res.status(401).send(unAuthorizedMessage);

    const file = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });

    if (!file || user._id != file.userId) return res.status(404).send(notFoundMessage);

    await dbClient.filesCollection.updateOne({ _id: ObjectId(fileId) }, { $set: { isPublic: true } });
    const updatedFile = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });
    return res.status(200).send(updatedFile);
  }

  static async putUnpublish(req, res) {
    const user = await userUtils.getUserBasedOnToken(req);
    const fileId = req.params.id;

    if (!user) return res.status(401).send(unAuthorizedMessage);

    const file = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });

    if (!file || user._id != file.userId) return res.status(404).send(notFoundMessage);

    await dbClient.filesCollection.updateOne({ _id: ObjectId(fileId) }, { $set: { isPublic: false } });
    const updatedFile = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });
    return res.status(200).send(updatedFile);
  }

  static async getFile(req, res) {
    const fileId = req.params.id;
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    const file = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });

    if (!file) return res.status(404).send(notFoundMessage);

    if (file.isPublic === false && file.userId !== userId) return res.status(404).send(notFoundMessage);

    const fileExists = existsSync(file.localPath);

    if (!fileExists) return res.status(404).send(notFoundMessage);
    let data;
    try {
      data = await promises.readFile(file.localPath);
    } catch (error) {
      return res.status(404).send(notFoundMessage);
    }
    const mimeType = mime.contentType(file.name);

    res.setHeader('Content-Type', mimeType);

    return res.status(200).send(data);
  }

  /**
   * Handle file deletion.
   * @param {Reqest} req 
   * @param {Response} res 
   * @param {import('express').NextFunction} next 
   * @returns 
   */
  static async deleteFile(req, res, next) {
    try {
      const result = await FileService.deleteFile(req.params, req);

      return res.status(204).json({
        statusCode: 204,
        data: result
      });
    } catch(error) {
      next(error);
    }
  }


  /**
   * Handle downloading a file.
   * @param {Request} req 
   * @param {Response} res 
   * @param {import('express').NextFunction} next 
   */
  static async downloadFile(req, res, next) {
    try {

      await FileService.downloadFile(req, res);

    } catch(error) {
      // Pass the error to the global error handler
      next(error);
    }
  }
}

export default FilesController;
