import { Router } from 'express';
import { getRoles } from '../controllers/various.controller'

const router = Router();

// Routes
router.get('/roles', getRoles);


export default router;