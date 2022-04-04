/**
 * https://github.com/webschik/mt940-js
 */
var mt940 = require('mt940-js');
var fs = require('fs');
var sql = require('mssql');
var log = [];

// Production
// const dbsettings = {
//     user: 'sa',
//     password: `Mobil2011`,
//     server: '192.168.168.9',
//     database: 'Liquidaciones',
//     options: {
//         trustServerCertificate: true,
//         encrypt: false //for azure
//     },
//     port: 1433
// };

// Test
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
    fs.appendFile(path + '/output/out.csv', data + "\n", function (err) {
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

// Obtenemos todas las empresas de la bd
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

            let license = await connect(empresas[i].servidor_sql, empresas[i].base_sql, empresas[i].sap_db_type, empresas[i].usuario_sql, empresas[i].contrasena_sql, empresas[i].usuario_sap, empresas[i].contrasena_sap, empresas[i].servidor_licencias);

            // Verificamos si es valida la licencia si no no hacemos nada
            if (license.valid) {
                // console.log(license.msg, empresas[i]);

                let ruta_archivos_bancos = empresas[i].ruta_archivos_bancos.replace(/\/$|$/, '/');
                let bancos = JSON.parse(empresas[i].bancos);

                // Truncate the output file
                await fs.truncate(ruta_archivos_bancos + '/output/out.csv', 0, function () {
                    console.log('Output truncated')
                });

                let cuentas = [];
                await writeOutput("#,AccountCode,DebitAmount,CreditAmount,DueDate,Memo,Reference,Server Response", ruta_archivos_bancos);
                // await writeOutput("Sequence	AccountCode	DebitAmount	CreditAmount	DueDate	Memo	Reference", ruta_archivos_bancos);
                for (let j = 0; j < bancos.length; j++) {
                    let path = ruta_archivos_bancos + bancos[j].BankCode + '/';

                    for (let k = 0; k < bancos[j].cuentas.length; k++) {
                        if (bancos[j].cuentas[k].Account !== null) {
                            let account = bancos[j].cuentas[k].Account.replace(/-/g, "");
                            cuentas.push({
                                account: account,
                                sys: bancos[j].cuentas[k].GLAccount
                            });
                        }
                    }

                    // console.log(cuentas);

                    let r = await readFiles(path, cuentas, empresas[i], ruta_archivos_bancos, license.msg);
                }
            }
        }

        return true;

    } catch (error) {
        console.log(error);
    }
}

const readFiles = async (bankFolder, cuentas, empresa, ruta_archivos_bancos, license) => {
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

                                        // let banco = "";
                                        // if (first.includes("I940INDLGTG")) {
                                        //     banco = "Industrial";
                                        // }
                                        // if (first.includes("I940BRRLGTGC")) {
                                        //     banco = "Banrural";
                                        // }
                                        // if (first.includes("I940CITIGB2LI")) {
                                        //     banco = "Citi";
                                        // }

                                        // console.log("Banco: ", banco);
                                        mt940.read(buffer).then(async (statements) => {
                                            let info = statements[0];
                                            let trans = info.transactions;

                                            var c = cuentas.filter(function (o) { return o.account == info.accountId; });

                                            // console.log("Cuenta:", info.accountId, c);

                                            for (let i = 0; i < trans.length; i++) {
                                                let info = [correlativo++];
                                                info.push(c[0].sys);
                                                let ammount = "";
                                                if (trans[i].isExpense) {
                                                    info.push(trans[i].amount);
                                                    info.push("");
                                                    ammount = `<DebitAmount>${trans[i].amount}</DebitAmount>`;
                                                } else {
                                                    info.push("");
                                                    info.push(trans[i].amount);
                                                    ammount = `<CreditAmount>${trans[i].amount}</CreditAmount>`;
                                                }
                                                info.push(trans[i].valueDate.replace(/-/g, ""));
                                                info.push(trans[i].code + " - " + trans[i].description);
                                                info.push(trans[i].customerReference);
                                                // console.log(info.join('\t'));

                                                // license
                                                let xml = `<?xml version="1.0" encoding="utf-8"?>
                                                            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                                                            <soap12:Body>
                                                                <AddPurchaseOrder xmlns="http://tempuri.org/wsSalesQuotation/Service1">
                                                                    <SessionID>${license}</SessionID>
                                                                    <sXmlOrderObject><![CDATA[<BOM xmlns='http://www.sap.com/SBO/DIS'><BO><AdmInfo><Object>oBankPages</Object></AdmInfo><BankPages><row><AccountCode>${c[0].sys}</AccountCode>${ammount}<DueDate>${trans[i].valueDate.replace(/-/g, "")}</DueDate><Memo>${trans[i].code + " - " + trans[i].description}</Memo><Reference>${trans[i].customerReference}</Reference></row></BankPages></BO></BOM>]]></sXmlOrderObject>
                                                                    </AddPurchaseOrder>
                                                                </soap12:Body>
                                                            </soap12:Envelope>`;
                                                var config = {
                                                    method: 'post',
                                                    url: `http://${empresa.servidor_licencias}/wsSalesQuotation/DiServerServices.asmx?WSDL`,
                                                    headers: {
                                                        'Content-Type': 'application/soap+xml'
                                                    },
                                                    data: xml
                                                };

                                                var axios = require('axios');
                                                const response = await axios(config);

                                                let xmlParser = require('xml2json');
                                                let r = JSON.parse(xmlParser.toJson(response.data));

                                                if (typeof r["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope'] !== "undefined") {
                                                    info.push("Respuesta: " + r["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']);
                                                } else {
                                                    info.push("Respuesta: " + JSON.stringify(r["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']).replace(/,/g, ''));
                                                }

                                                writeOutput(info.join(','), ruta_archivos_bancos);
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

const connect = async (servidor_sql, base_sql, sap_db_type, usuario_sql, contrasena_sql, usuario_sap, contrasena_sap, servidor_licencias) => {
    var axios = require('axios');

    try {
        var data = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <Login xmlns="http://tempuri.org/wsSalesQuotation/Service1">
              <DataBaseServer>${servidor_sql}</DataBaseServer>
              <DataBaseName>${base_sql}</DataBaseName>
              <DataBaseType>${sap_db_type}</DataBaseType>
              <DataBaseUserName>${usuario_sql}</DataBaseUserName>
              <DataBasePassword>${contrasena_sql}</DataBasePassword>
              <CompanyUserName>${usuario_sap}</CompanyUserName>
              <CompanyPassword>${contrasena_sap}</CompanyPassword>
              <Language>ln_English</Language>
              <LicenseServer>${servidor_licencias}:30000</LicenseServer>
            </Login>
          </soap12:Body>
        </soap12:Envelope>`;

        var config = {
            method: 'post',
            url: `http://${servidor_licencias}/wsSalesQuotation/DiServerServices.asmx?WSDL`,
            headers: {
                'Content-Type': 'application/soap+xml'
            },
            data: data
        };

        const response = await axios(config);

        let xmlParser = require('xml2json');
        let r = JSON.parse(xmlParser.toJson(response.data));
        r = r["soap:Envelope"]["soap:Body"]["LoginResponse"]["LoginResult"];

        return {
            valid: !r.includes("Error"),
            msg: r
        };

    } catch (err) {
        return {
            valid: false,
            msg: "¡Verifique la información del servidor de licencias!"
        };
    }
}