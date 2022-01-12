import { Router } from 'express';
import {
    getGastos,
    getGastosById,
    deleteGastoById,
    getGastosGrupo,
    updateGastoById,
    addNewGasto,
    getSubGastos
} from '../controllers/gastos.controller'

const router = Router();

// Routes
router.get('/gastos', getGastos);

router.get('/gasto/:id', getGastosById);

router.delete('/gastos/:id', deleteGastoById);

router.get('/gastos-grupo', getGastosGrupo);

router.get('/sub-gastos/:id', getSubGastos);

router.put('/gasto/:id', updateGastoById);

router.post('/gasto', addNewGasto);


export default router;