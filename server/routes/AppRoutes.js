import { Router } from 'express';
import AppController from '../controllers/AppController';

const router = Router();

// Return the status of mongodb server and redis server.
router.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

// Return the number users and files stored.
router.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

export default router;