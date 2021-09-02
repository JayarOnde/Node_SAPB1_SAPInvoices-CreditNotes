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

console.log(typeof process.env.DBPORT);

export async function getConnection(){
    try{
        const pool = await sql.connect(dbsettings);
        return pool;
    }catch(error){
        console.log(error);
    }
}
