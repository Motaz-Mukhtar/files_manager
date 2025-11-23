import { ObjectId } from 'mongodb';
import dbClient from './db';

class fileUtils {
  static async validateFileData(req) {
    let file;
    console.log(req.file);
    const {
      name, type, isPublic = false, data,
    } = req.body;
    const { parentId = 0 } = req.body;

    if (!name) return { error: 'Missing name' };

    if (!type)return { error: 'Missing type' };

    if (type !== 'file' && type !== 'image') return { error: 'Missing Type' };

    if (!data) return { error: 'Missing Data' };

    const fileObject = {
      name, type, parentId, isPublic, data,
    };
    return fileObject;
  }
}

export default fileUtils;
