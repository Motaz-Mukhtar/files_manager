import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();


// Log in the user, create token and store it
// in redis server.
router.get('/connect', (req, res) => {
  AuthController.getConnect(req, res);
});

// Log out the user, and delete the token
// at redis server.
router.get('/disconnect', (req, res) => {
  AuthController.getDisconnect(req, res);
});

export default router;
