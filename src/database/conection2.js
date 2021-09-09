import sql from 'mssql';
import config from '../config';

const dbsettings2 = {
    user: config.user2,
    password: config.password2,
    server: config.server2,
    database: config.database2,
    options: {
        trustServerCertificate: true,
        encrypt: false //for azure
    },
    port: 1433
};

export async function getConnection2(){
    try{
        const pool = new sql.ConnectionPool(dbsettings2);
        pool.on('error', err => {
            console.log('sql errors', err);
        });
        await pool.connect();
        return pool;
    }catch(error){
        console.log(error);
    }
}
