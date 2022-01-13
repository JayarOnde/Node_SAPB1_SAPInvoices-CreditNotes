var sql = require('mssql');
var log = [];

const dbsettings = {
    user: 'sa',
    password: `123`,
    server: '192.168.1.197',
    database: 'liquidaciones',
    options: {
        trustServerCertificate: true,
        encrypt: false //for azure
    },
    port: 1433
};

const execDTW = async (filepath) => {
    var exec = require('child_process').execFile;
    // exec('C:\\Program Files (x86)\\SAP\\Data Transfer Workbench\\DTW.exe', ['-s', 'C:\\lucalzabackend\\bankfiles\\texpetrolGT\\dtw.xml'], function (err, data) {
    exec('C:\\Program Files (x86)\\SAP\\Data Transfer Workbench\\DTW.exe', ['-s', filepath + 'dtw.xml'], function (err, data) {
        console.log(err)
        console.log(data.toString());
    });
}


const getEmpresas = async () => {
    try {
        const pool = new sql.ConnectionPool(dbsettings);
        pool.on('error', err => {
            console.log('sql errors', err);
        });

        await pool.connect();

        const query = `select
                 *
             from
                 au_empresa
             where 
                 bancos is not null`;
        const result = await pool
            .query(query);

        empresas = result.recordset;

        for (let i = 0; i < empresas.length; i++) {
            let ruta_archivos_bancos = empresas[i].ruta_archivos_bancos.replace(/\/$|$/, '/');
            await execDTW(ruta_archivos_bancos);
            console.log(ruta_archivos_bancos);
        }

    } catch (error) {
        console.log(error);
    }
}
getEmpresas();