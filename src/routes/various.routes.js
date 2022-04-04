import { Router } from 'express';
import {
    getProveedores,
    getRoles,
    insertProveedor
} from '../controllers/various.controller'

const router = Router();

// Routes
router.get('/roles', getRoles);

router.get('/proveedores', getProveedores);

router.post('/proveedor', insertProveedor);


export default router;