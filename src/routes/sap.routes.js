import { Router } from 'express';
import { 
    getProveedoresSAP,
    getUsuariosSAP,
    getCuentasContables,
    getImpuestos,
    getProyectos,
    getCentrosCosto
} from '../controllers/sap.controller'

const router = Router();

// Routes
router.get('/sap/proveedores/:id', getProveedoresSAP);

router.get('/sap/usuarios/:id', getUsuariosSAP);

router.get('/sap/cuentas-contables/:id', getCuentasContables);

router.get('/sap/impuestos/:id', getImpuestos);

router.get('/sap/proyectos/:id', getProyectos);

router.get('/sap/centros-costo/:id', getCentrosCosto);


export default router;