import { Router } from 'express';
import {
    createNewUser,
    getUsers,
    getUserById,
    deleteUserById,
    countUsers,
    updateUserById,
    login,
    savePresupuestoEmpresa,
    getPresupuestoEmpresa
} from '../controllers/users.controller'

const router = Router();

// Routes
router.get('/users', getUsers);

router.get('/users/count', countUsers);

router.post('/users', createNewUser);

router.get('/users/:id', getUserById);

router.delete('/users/:id', deleteUserById);

router.put('/users/:id', updateUserById);

router.post('/users/login', login);

router.post('/users/save-presupuesto-empresa', savePresupuestoEmpresa);

router.post('/get-presupuesto-empresa', getPresupuestoEmpresa);


export default router;