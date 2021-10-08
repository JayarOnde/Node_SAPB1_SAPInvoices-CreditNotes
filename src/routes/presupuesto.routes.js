import { Router } from 'express';
import {
    getPresupuestos
} from '../controllers/presupuesto.controller'

const router = Router();

// Routes
router.get('/presupuestos', getPresupuestos);

// router.get('/banco/:id', getBancoById);

// router.put('/banco/:id', updateBancoById);

// router.post('/banco', addNewBanco);

// router.delete('/bancos/:id', deleteBancoById);

// router.get('/cuentas', getCuentas);

// router.get('/cuentas/:id', getCuentasById);

// router.put('/cuenta/:id', updateCuentaById);

// router.post('/cuenta', addNewCuenta);

// router.delete('/cuentas/:id', deleteCuentaById);


export default router;