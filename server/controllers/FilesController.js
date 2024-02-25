import { ObjectId } from 'mongodb';
import { existsSync, promises, fsPromises, unlink } from 'fs';
import { v4 } from 'uuid';
import mime from 'mime-types';
import userUtils from '../utils/user';
import fileUtils from '../utils/file';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const unAuthorizedMessage = { error: 'Unauthorized' };
const notFoundMessage = { error: 'Not Found' };
const FOLDER_PATH = process.env.FOLDER_PATH || 'tmp';

class FilesController {
  static async postUpload(req, res) {
    const user = await userUtils.getUserBasedOnToken(req);
    const file = await fileUtils.validateFileData(req);

    if (!user) return res.status(401).send(unAuthorizedMessage);

    if (file.error) return res.status(400).send({ error: file.error });

    file.userId = user._id.toString();

    const fileName = v4();

    const filePath = `${FOLDER_PATH}/${fileName}`;
    const buffer = Buffer.from(decodeURIComponent(escape(file.data)), 'base64');
    try {
      if (file.type === 'folder')
        await promises.mkdir(filePath, { recursive: true });
      else {
        await promises.writeFile(filePath, buffer, { encoding: 'utf8' });
      }
    } catch (error) {
      return res.status(400).send({ error });
    }
    file.localPath = filePath;

    // Insert the file without the file content.
    delete file.data;

    await dbClient.filesCollection.insertOne(file);
    return res.status(201).send(file);
  }

  // Retrieve file based on id.
  static async getShow(req, res) {
    const user = await userUtils.getUserBasedOnToken(req);

    if (!user) return res.status(401).send(unAuthorizedMessage);
    const file = await dbClient.filesCollection.findOne({_id: ObjectId(req.params.id)})
    
    if (!file) return res.status(404).send(notFoundMessage);

    return res.status(200).send(file);
  }

  static async getIndex(req, res) {
    const user = await userUtils.getUserBasedOnToken(req);

    if (!user) return res.status(401).send(unAuthorizedMessage);

    const parentId = req.query.parentId || 0;
    const page = req.query.page || 0;
    const limit = req.query.limit || 20;
    const skip = page * limit;

    const files = await dbClient.filesCollection.find({ userId: `${user._id}` })
      .skip(skip).limit(limit).toArray();
    const fileArray = files.map((file) => ({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    }));
    return res.status(200).send(fileArray);
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

  static async deleteFile(req, res) {
    const fileId = req.params.id;
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    const file = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });

    if (!userId || userId !== file.userId) return res.status(401).send(unAuthorizedMessage);

    if (!file) return res.status(404).send(notFoundMessage);

    unlink(file.localPath, async (error) => {
      if (error) {
        console.log(error, error.message)
        return res.status(500).send({ error: `Failed to delete file: ${error.message}`});
      }

      await dbClient.filesCollection.deleteOne({ _id: ObjectId(fileId) });

      return res.status(200).send({});
    })
  }

  static async downloadFile(req, res) {
    const fileId = req.params.fileId;
    const file = await dbClient.filesCollection.findOne({ _id: ObjectId(fileId) });

    if (!file || file.isPublic === false) return res.status(404).send(notFoundMessage);
    console.log(file)
    const mimeType = mime.contentType(file.name);

    res.setHeader('Content-Type', mimeType);

    res.download(file.localPath, (error) => {
      if (error) {
        return res.status(500).send({ error: 'Failed to download file '});
      }
    })

  }
}

export default FilesController;
