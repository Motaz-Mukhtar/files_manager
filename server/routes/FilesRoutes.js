import { Router } from 'express';
import FilesController from '../controllers/FilesController';
import verifyToken from '../middleware/verifyToken';

const router = Router();

// Upload file.
router.post('/files', (req, res) => {
  FilesController.postUpload(req, res);
});

// Retrieve file based on id.
router.get('/files/:id', (req, res) => {
  FilesController.getShow(req, res);
});

// Retrieve all user files.
router.get('/files', FilesController.getIndex);

// Make a file public based on id.
router.put('/files/:id/publish', (req, res) => {
  FilesController.putPublish(req, res);
});

// Make a file private based on id.
router.put('/files/:id/unpublish', (req, res) => {
  FilesController.putUnpublish(req, res);
});

// Retrieve file content based on id.
router.get('/files/:id/data', (req, res) => {
  FilesController.getFile(req, res);
});

// Delete file based on id.
router.delete('/files/:id', (req, res) => {
  FilesController.deleteFile(req, res);
});

// Download file based on id.
router.get('/download/:fileId', (req, res) => {
  FilesController.downloadFile(req, res);
})

export default router;