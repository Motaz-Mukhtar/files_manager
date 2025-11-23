import express from 'express';

import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

import multerStorage from '../config/multerConfig';

const router = express.Router();

// Return the status of mongodb server and redis server.
router.get('/api/status', (req, res) => {
  AppController.getStatus(req, res);
});

// Return the number users and files stored.
router.get('/api/stats', (req, res) => {
  AppController.getStats(req, res);
});

// Retrieve all users data.
router.post('/api/users', (req, res) => {
  UsersController.postNew(req, res);
});

// Log in the user, create token and store it
// in redis server.
router.get('/api/connect', (req, res) => {
  AuthController.getConnect(req, res);
});

// Log out the user, and delete the token
// at redis server.
router.get('/api/disconnect', (req, res) => {
  AuthController.getDisconnect(req, res);
});

// Return user data.
router.get('/api/users/me', (req, res) => {
  UsersController.getMe(req, res);
});

// Upload file.
router.post('/api/files',
  multerStorage.upload.single('file'),
  multerStorage.validteFileUpload,
  (req, res, next) => {
  FilesController.postUpload(req, res, next);
});

// Retrieve file based on id.
router.get('/api/files/:id', (req, res) => {
  FilesController.getShow(req, res);
});

// Retrieve all user files.
router.get('/api/files', (req, res) => {
  FilesController.getIndex(req, res);
});

// Make a file public based on id.
router.put('/api/files/:id/publish', (req, res) => {
  FilesController.putPublish(req, res);
});

// Make a file private based on id.
router.put('/api/files/:id/unpublish', (req, res) => {
  FilesController.putUnpublish(req, res);
});

// Retrieve file content based on id.
router.get('/api/files/:id/data', (req, res) => {
  FilesController.getFile(req, res);
});

// Delete file based on id.
router.delete('/api/files/:id', (req, res, next) => {
  FilesController.deleteFile(req, res, next);
});

// Download file based on id.
router.get('/download/:fileId', (req, res, next) => {
  FilesController.downloadFile(req, res, next);
})

export default router;
