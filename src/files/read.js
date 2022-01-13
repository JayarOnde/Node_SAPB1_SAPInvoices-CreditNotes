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

const writeLog = async (data) => {
    fs.appendFile('./banklog.txt', data + "\n", function (err) {
        if (err) return console.log(err);
    });
}

const writeOutput = async (data, path) => {
    fs.appendFile(path + '/output/out.txt', data + "\n", function (err) {
        if (err) return console.log(err);
    });
}

const moveFile = async (folder, file) => {
    let end = folder + "processed";
    if (!fs.existsSync(end)) {
        fs.mkdirSync(end);
    }
    fs.rename(folder + file, folder + "processed/" + file, function (err) {
        // console.log('Successfully renamed - AKA moved!')
    })
}
let empresas;
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
            let bancos = JSON.parse(empresas[i].bancos);

            let cuentas = [];
            await writeOutput("Sequence	AccountCode	DebitAmount	CreditAmount	DueDate	Memo	Reference", ruta_archivos_bancos);
            await writeOutput("Sequence	AccountCode	DebitAmount	CreditAmount	DueDate	Memo	Reference", ruta_archivos_bancos);
            for (let j = 0; j < bancos.length; j++) {
                let path = ruta_archivos_bancos + bancos[j].BankCode + '/';

                // Truncate the output file
                await fs.truncate(ruta_archivos_bancos + '/output/' + bancos[j].BankCode + '.txt', 0, function () {
                    console.log('Output truncated')
                });

                for (let k = 0; k < bancos[j].cuentas.length; k++) {
                    let account = bancos[j].cuentas[k].Account.replace(/-/g, "");
                    cuentas.push({
                        account: account,
                        sys: bancos[j].cuentas[k].GLAccount
                    });
                }

                // console.log(bancos[j].BankCode);
                // console.log(cuentas);

                let r = await readFiles(path, cuentas, bancos[j].BankCode, ruta_archivos_bancos);
            }
        }

        return true;

    } catch (error) {
        console.log(error);
    }
}

const readFiles = async (bankFolder, cuentas, bankCode, ruta_archivos_bancos) => {
    let correlativo = 1;
    try {
        await fs.access(bankFolder, fs.constants.R_OK, (err) => {
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

                                        // console.log("Banco: ", banco);
                                        mt940.read(buffer).then((statements) => {
                                            let info = statements[0];
                                            let trans = info.transactions;

                                            var c = cuentas.filter(function (o) { return o.account == info.accountId; });

                                            // console.log("Cuenta:", info.accountId, c[0].sys, cuentas);

                                            for (let i = 0; i < trans.length; i++) {
                                                let info = [correlativo++];
                                                info.push(c[0].sys);
                                                if (trans[i].isExpense) {
                                                    info.push(trans[i].amount);
                                                    info.push("");
                                                } else {
                                                    info.push("");
                                                    info.push(trans[i].amount);
                                                }
                                                info.push(trans[i].valueDate.replace(/-/g, ""));
                                                info.push(trans[i].code + " - " + trans[i].description);
                                                info.push(trans[i].customerReference);
                                                writeOutput(info.join('\t'), ruta_archivos_bancos);
                                                console.log(info.join('\t'));
                                            }
                                        });
                                        moveFile(bankFolder, file);
                                    });
                                }
                            }
                        });
                        // console.log(log);
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
            // console.log(empresas, "<<<>><>><><><");
            //  console.log(data);
            // process.exit();

        });