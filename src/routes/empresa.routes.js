import { Router } from 'express';
import { getEmpresas, getEmpresaById, updateEmpresaById, addNewEmpresa } from '../controllers/empresa.controller'

const router = Router();

// Routes
router.get('/empresa', getEmpresas);

router.get('/empresa/:id', getEmpresaById);

router.put('/empresa/:id', updateEmpresaById);

router.post('/empresa', addNewEmpresa);

export default router;