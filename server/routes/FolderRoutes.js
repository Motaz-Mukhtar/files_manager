import { Router } from "express";
import FoldersController from "../controllers/FoldersController";
import verifyToken from "../middleware/verifyToken";


const router = Router();

// Get folder files by folder id
router.get('/folders/:folderId', verifyToken, (req, res, next) =>{
    FoldersController.getFolderFiles(req, res, next);
});

// Create folder.
router.post('/folders', verifyToken, (req, res, next) => {
  FoldersController.newFolder(req, res, next);
});

// Delete folder by id.
router.delete('/folders/:folderId', verifyToken, (req, res, next) => {
    FoldersController.deleteFolder(req, res, next);
});

export default router;