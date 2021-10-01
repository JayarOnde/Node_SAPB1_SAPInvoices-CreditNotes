import { Router } from 'express';
import { 
    getEmpresas, 
    getEmpresaById, 
    updateEmpresaById, 
    addNewEmpresa,
    validateEmpresaSQL, 
    deleteEmpresaById
} from '../controllers/empresa.controller'

const router = Router();

// Routes
router.get('/empresa', getEmpresas);

router.get('/empresa/:id', getEmpresaById);

router.put('/empresa/:id', updateEmpresaById);

router.post('/empresa', addNewEmpresa);

router.delete('/empresas/:id', deleteEmpresaById);

router.post('/validate-empresa-sql', validateEmpresaSQL);

export default router;