import express from 'express';
import cors from 'cors';
import config from './config';

import usersRoutes from './routes/users.routes';
import EmpresasRoutes from './routes/empresa.routes';
import SAPRoutes from './routes/sap.routes';
import variousRoutes from './routes/various.routes';
import bancoRoutes from './routes/banco.routes';
import gastosRoutes from './routes/gastos.routes';
import presupuestosRoutes from './routes/presupuesto.routes';


const app = express();

// settings
app.set('port', config.port);
app.use(cors());
// Middlewares
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

app.use(usersRoutes);
app.use(EmpresasRoutes);
app.use(SAPRoutes);
app.use(variousRoutes);
app.use(bancoRoutes);
app.use(gastosRoutes);
app.use(presupuestosRoutes);

export default app;