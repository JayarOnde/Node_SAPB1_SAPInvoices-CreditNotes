import { Router } from 'express';
import { getProveedoresSAP,getUsuariosSAP } from '../controllers/sap.controller'

const router = Router();

// Routes
router.get('/sap/proveedores', getProveedoresSAP);

router.get('/sap/usuarios', getUsuariosSAP);

// router.get('/empresa/count', countUsers);

// router.post('/empresa', createNewUser);

// router.get('/empresa/:id', getUserById);

// router.delete('/empresa/:id', deleteProductById);

// router.put('/empresa/:id',updateUserById);

// router.post('/empresa/login',login);


export default router;