import multer from 'multer';
import { config } from 'dotenv';
import AppError from '../utils/AppError';
import { v4 } from 'uuid';

// Load environment variables from .env file
config();

class MulterConfig {
    constructor() {
        this.destination = process.env.FILES_DESTINATION || './uploads';

        this.storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, this.destination),
            filename: (req, file, cb) => cb(null, `${v4()}-${file.originalname}`)
        });

        this.upload = multer({ storage: this.storage });
    }

    /**
     * Validate uploaded file
     * @param {Object} file 
     * @returns 
     */
    validteFileUpload(req, res, next) {
        const { file } = req;

        if (!file)
            throw new AppError("No file uploaded", 400);

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];

        if (!allowedMimeTypes.includes(file.mimetype)) 
            throw new AppError("Invalid file type", 400);

        next();
    }
}

const multerStorage = new MulterConfig();

export default multerStorage;