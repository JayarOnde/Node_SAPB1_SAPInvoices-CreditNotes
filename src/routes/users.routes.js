import { Router } from 'express';
import { createNewUser, getUsers, getUserById, deleteUserById, countUsers, updateUserById, login } from '../controllers/users.controller'

const router = Router();

// Routes
router.get('/users', getUsers);

router.get('/users/count', countUsers);

router.post('/users', createNewUser);

router.get('/users/:id', getUserById);

router.delete('/users/:id', deleteUserById);

router.put('/users/:id',updateUserById);

router.post('/users/login',login);


export default router;