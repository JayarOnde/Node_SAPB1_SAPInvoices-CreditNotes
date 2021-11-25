/**
 * https://github.com/webschik/mt940-js
 */
var mt940 = require('mt940-js');
var fs = require('fs');
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

const writeLog = (data) => {
    fs.appendFile('./banklog.txt', data + "\n", function (err) {
        if (err) return console.log(err);
    });
}

const moveFile = (folder, file) => {
    let end = folder + "processed";
    if (!fs.existsSync(end)) {
        fs.mkdirSync(end);
    }
    fs.rename(folder + file, folder + "processed/" + file, function (err) {
        // console.log('Successfully renamed - AKA moved!')
    })
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

        let empresas = result.recordset;

        for (let i = 0; i < empresas.length; i++) {
            let servidor_licencias = empresas[i].servidor_licencias;
            let usuario_sap = empresas[i].usuario_sap;
            let contrasena_sap = empresas[i].contrasena_sap;
            let usuario_sql = empresas[i].usuario_sql;
            let ruta_archivos_bancos = empresas[i].ruta_archivos_bancos.replace(/\/$|$/, '/');
            let sap_db_type = empresas[i].sap_db_type;
            let contrasena_sql = empresas[i].contrasena_sql;
            let servidor_sql = empresas[i].servidor_sql;
            let base_sql = empresas[i].base_sql;
            let bancos = JSON.parse(empresas[i].bancos);

            for (let j = 0; j < bancos.length; j++) {
                let path = ruta_archivos_bancos + bancos[j].BankCode + '/';

                let r = await readFiles(path);
            }
        }

        return true;

    } catch (error) {
        console.log(error);
    }
}


const readFiles = async (bankFolder) => {
    try {
        fs.access(bankFolder, fs.constants.R_OK, (err) => {
            if (!err) {
                fs.readdir(bankFolder, (err, files) => {
                    if (typeof files !== 'undefined') {
                        let b = bankFolder.split("/");
                        log.push({
                            'bank': b[b.length - 2],
                            'count': files.length
                        });
                        files.forEach(async file => {
                            // Si no es directorio
                            if (!fs.lstatSync(`${bankFolder}${file}`).isDirectory()) {
                                let dot = file.split(".");
                                // If is not a dot file
                                if (dot[0] !== '') {
                                    // Read MT940
                                    fs.readFile(`${bankFolder}${file}`, (error, buffer) => {
                                        const arr = buffer.toString().replace(/\r\n/g, '\n').split('\n');
                                        const first = arr[0].toUpperCase();

                                        let banco = "";
                                        if (first.includes("I940INDLGTG")) {
                                            banco = "Industrial";
                                        }
                                        if (first.includes("I940BRRLGTGC")) {
                                            banco = "Banrural";
                                        }
                                        if (first.includes("I940CITIGB2LI")) {
                                            banco = "Citi";
                                        }

                                        console.log("Banco: ", banco);
                                        mt940.read(buffer).then((statements) => {
                                            let info = statements[0];
                                            console.log(info);
                                            let trans = info.transactions;

                                            console.log("Cuenta:", info.accountId);

                                            for (let i = 0; i < trans.length; i++) {
                                                let obj = {};
                                                obj.id = trans[i].id;
                                                obj.tipo = "credito";
                                                if (trans[i].isExpense) {
                                                    tipo = "debito";
                                                }
                                                obj.moneda = trans[i].currency;
                                                obj.descripcion = trans[i].description;
                                                obj.monto = trans[i].amount;
                                                obj.fecha = trans[i].valueDate;

                                                // console.log(obj);
                                            }
                                        });
                                        moveFile(bankFolder, file);
                                    });
                                }
                            }
                        });
                        console.log(log);
                        writeLog(JSON.stringify(log));
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

writeLog("----------------------------------------------------------------");
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
writeLog(date);
getEmpresas().
    then(
        data => {
            console.log(data);
            // process.exit();
        });