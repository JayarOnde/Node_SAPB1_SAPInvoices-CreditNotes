import { Router } from 'express';
import { 
    getProveedoresSAP,
    getUsuariosSAP,
    getCuentasContables,
    getImpuestos
} from '../controllers/sap.controller'

const router = Router();

// Routes
router.get('/sap/proveedores', getProveedoresSAP);

router.get('/sap/usuarios', getUsuariosSAP);

router.get('/sap/cuentas-contables', getCuentasContables);

router.get('/sap/impuestos', getImpuestos);


export default router;