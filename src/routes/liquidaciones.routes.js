import { Router } from 'express';
import {
    getLiquidaciones,
    addLiquidacion,
    getLiquidacionById,
    updateLiquidacionById,
    deleteLiquidacionById,
    getGastosByUserLiquidacion,
    enviarAprobacionSupervisor,
    enviarAprobacionContador,
    rechazoSupervisor,
    rechazoContabilidad,
    subirSAP,
    calculoFactura,
    deleteFacturaByID,
    rechazoFacturaByID
} from '../controllers/liquidaciones.controller'

const router = Router();

// Routes
router.get('/liquidaciones', getLiquidaciones);

router.post('/liquidacion', addLiquidacion);

router.get('/liquidacion/:id', getLiquidacionById);

router.put('/liquidacion/:id', updateLiquidacionById);

router.delete('/liquidacion/:id', deleteLiquidacionById);

router.post('/liquidacion-enviar-aprobacion-supervisor/:id', enviarAprobacionSupervisor);

router.post('/liquidacion-enviar-rechazo-supervisor', rechazoSupervisor);

router.post('/liquidacion-enviar-aprobacion-contador/:id', enviarAprobacionContador);

router.post('/liquidacion-enviar-rechazo-contabilidad', rechazoContabilidad);

router.post('/liquidacion-subir-sap/:id', subirSAP);

router.get('/liquidacion-gastos/:user/:presupuesto', getGastosByUserLiquidacion);

router.post('/calculo-factura/:liquidacion_id/:id', calculoFactura);

router.post('/liquidacion-delete-factura/:id', deleteFacturaByID);

router.post('/rechazo-factura/:id', rechazoFacturaByID);


export default router;