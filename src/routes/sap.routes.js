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
router.get('/sap/proveedores', getProveedoresSAP);

router.get('/sap/usuarios', getUsuariosSAP);

router.get('/sap/cuentas-contables', getCuentasContables);

router.get('/sap/impuestos', getImpuestos);

router.get('/sap/proyectos/:id', getProyectos);

router.get('/sap/centros-costo/:id', getCentrosCosto);


export default router;