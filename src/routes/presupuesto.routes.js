import { Router } from 'express';
import {
    getCategoriaGasto,
    getFrecuenciaGasto,
    getPresupuestos,
    getTipoGasto,
    updatePresupuestoById,
    getPresupuestoById,
    addNewPresupuesto,
    deletePresupuestoById,
    getPresupuestosEmpresa,
    getEmpresaPresupuesto
} from '../controllers/presupuesto.controller'

const router = Router();

// Routes
router.get('/presupuestos', getPresupuestos);

router.get('/presupuesto/:id', getPresupuestoById);

router.get('/tipo-gasto', getTipoGasto);

router.get('/categoria-gasto', getCategoriaGasto);

router.get('/frecuencia-gasto', getFrecuenciaGasto);

router.put('/presupuesto/:id', updatePresupuestoById);

router.post('/presupuesto', addNewPresupuesto);

router.delete('/presupuesto/:id', deletePresupuestoById);

router.get('/presupuestos-empresa/:id', getPresupuestosEmpresa);

router.get('/empresa-by-presupuesto/:id', getEmpresaPresupuesto);

export default router;