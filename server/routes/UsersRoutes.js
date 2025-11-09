import { Router } from 'express';

import UsersController from '../controllers/UsersController';

const router = Router();


// Retrieve all users data.
router.post('/users', (req, res) => {
  UsersController.postNew(req, res);
});

// Return user data.
router.get('/users/me', (req, res) => {
  UsersController.getMe(req, res);
});


export default router;
