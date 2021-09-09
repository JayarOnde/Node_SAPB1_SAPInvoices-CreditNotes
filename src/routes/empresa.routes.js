import { Router } from 'express';
import { getEmpresas } from '../controllers/empresa.controller'

const router = Router();

// Routes
router.get('/empresa', getEmpresas);

// router.get('/empresa/count', countUsers);

// router.post('/empresa', createNewUser);

// router.get('/empresa/:id', getUserById);

// router.delete('/empresa/:id', deleteProductById);

// router.put('/empresa/:id',updateUserById);

// router.post('/empresa/login',login);


export default router;