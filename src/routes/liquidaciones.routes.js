import { Router } from 'express';
import {
    getLiquidaciones,
    addLiquidacion,
    getLiquidacionById,
    updateLiquidacionById,
    deleteLiquidacionById
} from '../controllers/liquidaciones.controller'

const router = Router();

// Routes
router.get('/liquidaciones', getLiquidaciones);

router.post('/liquidacion', addLiquidacion);

router.get('/liquidacion/:id', getLiquidacionById);

router.put('/liquidacion/:id', updateLiquidacionById);

router.delete('/liquidacion/:id', deleteLiquidacionById);


export default router;