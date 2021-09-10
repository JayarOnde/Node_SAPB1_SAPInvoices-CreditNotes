import { Router } from 'express';
import {
    getBancos,
    getBancoById,
    getCuentas,
    getCuentasById,
    updateBancoById,
    addNewBanco,
    deleteBancoById,
    updateCuentaById,
    addNewCuenta,
    deleteCuentaById
} from '../controllers/banco.controller'

const router = Router();

// Routes
router.get('/bancos', getBancos);

router.get('/banco/:id', getBancoById);

router.put('/banco/:id', updateBancoById);

router.post('/banco', addNewBanco);

router.delete('/bancos/:id', deleteBancoById);

router.get('/cuentas', getCuentas);

router.get('/cuentas/:id', getCuentasById);

router.put('/cuenta/:id', updateCuentaById);

router.post('/cuenta', addNewCuenta);

router.delete('/cuentas/:id', deleteCuentaById);


export default router;