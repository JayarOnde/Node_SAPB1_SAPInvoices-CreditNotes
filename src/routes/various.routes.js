import { Router } from 'express';
import {
    getProveedores,
    getRoles
} from '../controllers/various.controller'

const router = Router();

// Routes
router.get('/roles', getRoles);

router.get('/proveedores', getProveedores);


export default router;