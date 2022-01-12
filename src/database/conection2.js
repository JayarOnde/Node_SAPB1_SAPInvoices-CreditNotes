import sql from 'mssql';
import config from '../config';
import { getConnection, queriesEmpresas } from '../database';

export async function getConnection2(id) {
    const poolE = await getConnection();
    const result = await poolE
        .request()
        .input('id', sql.BigInt, id)
        .query(queriesEmpresas.getEmpresaById);
    let r = result.recordset[0];

    const dbsettings2 = {
        user: r.usuario_sql,
        password: r.contrasena_sql,
        server: r.servidor_sql,
        database: r.base_sql,
        options: {
            trustServerCertificate: true,
            encrypt: false //for azure
        },
        port: 1433
    };

    try {
        const pool = new sql.ConnectionPool(dbsettings2);
        pool.on('error', err => {
            console.log('sql errors', err);
        });
        await pool.connect();
        return pool;
    } catch (error) {
        console.log(error);
    }
}
