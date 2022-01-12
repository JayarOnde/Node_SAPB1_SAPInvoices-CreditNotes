import sql from 'mssql';
import config from '../config';

const dbsettings = {
    user: config.user,
    password: config.password,
    server: config.server,
    database: config.database,
    options: {
        trustServerCertificate: true,
        encrypt: false //for azure
    },
    port: 1433
};


export async function getConnection(){
    try{
        const pool = new sql.ConnectionPool(dbsettings);
        pool.on('error', err => {
            console.log('sql errors', err);
        });
        await pool.connect();
        return pool;
    }catch(error){
        console.log(error);
    }
}
