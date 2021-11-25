import sql from 'mssql';
import { getConnection, queriesEmpresas } from '../database';

export const getEmpresas = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(queriesEmpresas.getAllEmpresas);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getEmpresaById = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(queriesEmpresas.getEmpresaById);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const deleteEmpresaById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(queriesEmpresas.deleteEmpresaById);

        res.json({ msg: "Empresa eliminada exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateEmpresaById = async (req, res) => {
    // const { nombre, email, password, supervisor, empresas, roles } = req.body;
    const { id } = req.params;

    // Validate sql parameters
    let valSQL = await validateSQL(
        req.body.usuario_sql,
        req.body.base_sql,
        req.body.contrasena_sql,
        req.body.servidor_sql,
    );

    if (!valSQL.valid) {
        res.status(500);
        res.send("¡Verifique los datos de conexión SQL!");
        return;
    }

    // validate licence parameters
    let lic = await validateLicencia(
        req.body.servidor_licencias,
        req.body.base_sql,
        req.body.usuario_sap,
        req.body.contrasena_sap,
        req.body.usuario_sql,
        req.body.contrasena_sql,
        req.body.sap_db_type,
        req.body.servidor_sql
    );

    if (!lic.valid) {
        res.status(500);
        res.send(lic.msg);
        return;
    }

    let ex = await existeEmpresa(req.body.base_sql, req.body.servidor_sql);

    if (
        parseInt(ex) === parseInt(id) ||
        parseInt(ex) === -1
    ) {
        try {
            const pool = await getConnection();
            await pool
                .request()
                .input('nombre', sql.VarChar, req.body.nombre)
                .input('servidor_licencias', sql.VarChar, req.body.servidor_licencias)
                .input('usuario_sap', sql.VarChar, req.body.usuario_sap)
                .input('contrasena_sap', sql.VarChar, req.body.contrasena_sap)
                .input('segundos_espera', sql.VarChar, req.body.segundos_espera)
                .input('ruta_archivos', sql.VarChar, req.body.ruta_archivos)
                .input('usuario_sql', sql.VarChar, req.body.usuario_sql)
                .input('sap_db_type', sql.VarChar, req.body.sap_db_type)
                .input('contrasena_sql', sql.VarChar, req.body.contrasena_sql)
                .input('servidor_sql', sql.VarChar, req.body.servidor_sql)
                .input('base_sql', sql.VarChar, req.body.base_sql)
                .input('moneda_local', sql.VarChar, req.body.moneda_local)
                .input('moneda_extranjera', sql.VarChar, req.body.moneda_extranjera)
                .input('dias_atraso_facturacion_ruta', sql.Int, req.body.dias_atraso_facturacion_ruta)
                .input('valor_impuesto', sql.Int, req.body.valor_impuesto)
                .input('dias_atraso_facturacion_gastos', sql.Int, req.body.dias_atraso_facturacion_gastos)
                .input('no_identificacion_fiscal', sql.VarChar, req.body.no_identificacion_fiscal)
                .input('dia_efectivo_ajuste', sql.Int, req.body.dia_efectivo_ajuste)
                .input('remanente_nota_credito', sql.TinyInt, req.body.remanente_nota_credito)
                .input('maneja_xml', sql.TinyInt, req.body.maneja_xml)
                .input('ajuste_fin_mes', sql.TinyInt, req.body.ajuste_fin_mes)
                .input('bd_sap', sql.VarChar, req.body.bd_sap)
                .input('control_numero_factura', sql.TinyInt, req.body.control_numero_factura)
                .input('label_impuesto', sql.VarChar, req.body.label_impuesto)
                .input('sap_db_type_label', sql.VarChar, req.body.sap_db_type_label)
                .input('ruta_archivos_bancos', sql.VarChar, req.body.ruta_archivos_bancos)
                .input('id', id)
                .input('bancos', req.body.bancos)
                .query(queriesEmpresas.updateEmpresaById);

            res.json({ msg: "¡Empresa actualizada con éxito!" });

        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
    } else {
        res.status(500);
        res.send("Ya existe un usuario con estos datos");
    }


};

export const addNewEmpresa = async (req, res) => {
    // const { nombre, email, password, supervisor, empresas, roles } = req.body;
    const { id } = req.params;

    let ex = await existeEmpresa(req.body.base_sql, req.body.servidor_sql);

    if (parseInt(ex) === parseInt(id)) {
        try {
            const pool = await getConnection();
            await pool
                .request()
                .input('nombre', sql.VarChar, req.body.nombre)
                .input('servidor_licencias', sql.VarChar, req.body.servidor_licencias)
                .input('usuario_sap', sql.VarChar, req.body.usuario_sap)
                .input('contrasena_sap', sql.VarChar, req.body.contrasena_sap)
                .input('segundos_espera', sql.VarChar, req.body.segundos_espera)
                .input('ruta_archivos', sql.VarChar, req.body.ruta_archivos)
                .input('usuario_sql', sql.VarChar, req.body.usuario_sql)
                .input('sap_db_type', sql.VarChar, req.body.sap_db_type)
                .input('contrasena_sql', sql.VarChar, req.body.contrasena_sql)
                .input('servidor_sql', sql.VarChar, req.body.servidor_sql)
                .input('base_sql', sql.VarChar, req.body.base_sql)
                .input('moneda_local', sql.VarChar, req.body.moneda_local)
                .input('moneda_extranjera', sql.VarChar, req.body.moneda_extranjera)
                .input('dias_atraso_facturacion_ruta', sql.Int, req.body.dias_atraso_facturacion_ruta)
                .input('valor_impuesto', sql.Int, req.body.valor_impuesto)
                .input('dias_atraso_facturacion_gastos', sql.Int, req.body.dias_atraso_facturacion_gastos)
                .input('no_identificacion_fiscal', sql.VarChar, req.body.no_identificacion_fiscal)
                .input('dia_efectivo_ajuste', sql.Int, req.body.dia_efectivo_ajuste)
                .input('remanente_nota_credito', sql.TinyInt, req.body.remanente_nota_credito)
                .input('maneja_xml', sql.TinyInt, req.body.maneja_xml)
                .input('ajuste_fin_mes', sql.TinyInt, req.body.ajuste_fin_mes)
                .input('bd_sap', sql.VarChar, req.body.bd_sap)
                .input('control_numero_factura', sql.TinyInt, req.body.control_numero_factura)
                .input('label_impuesto', sql.VarChar, req.body.label_impuesto)
                .input('sap_db_type_label', sql.VarChar, req.body.sap_db_type_label)
                .input('ruta_archivos_bancos', sql.VarChar, req.body.ruta_archivos_bancos)
                .input('id', id)
                .input('bancos', req.body.bancos)
                .query(queriesEmpresas.addNewEmpresa);
        } catch (err) {
            res.status(500);
            res.send(err.message);
        }

        res.json({ msg: "¡Empresa creada con éxito!" });
    } else {
        res.status(500);
        res.send("Ya existe un usuario con estos datos");
    }
};

export const validateEmpresaSQL = async (req, res) => {
    const { usuario_sql, base_sql, contrasena_sql, servidor_sql } = req.body;
    try {
        const dbsettings = {
            user: usuario_sql,
            password: contrasena_sql,
            server: servidor_sql,
            database: base_sql,
            options: {
                trustServerCertificate: true,
                encrypt: false //for azure
            },
            port: 1433
        };

        const pool = new sql.ConnectionPool(dbsettings);
        await pool.connect();

        let ret = {
            valid: true,
            info: null,
            impuestos: null,
            bancos: null
        };
        const result = await pool
            .request()
            .query(queriesEmpresas.getSAPInfo);
        ret.info = result.recordset;

        const result2 = await pool
            .request()
            .query(queriesEmpresas.getSAPImpuestos);
        ret.impuestos = result2.recordset;

        const result3 = await pool
            .request()
            .query(queriesEmpresas.getBancos);
        let bancos = result3.recordset;

        for (let i = 0; i < bancos.length; i++) {
            const result4 = await pool
                .request()
                .input('CountryCod', sql.VarChar, bancos[i].CountryCod)
                .input('BankCode', sql.VarChar, bancos[i].BankCode)
                .query(queriesEmpresas.getCuentas);
            bancos[i].cuentas = result4.recordset;
        }

        ret.bancos = bancos;

        res.json(ret);
    } catch (err) {
        res.json({ valid: false, err: err });
    }
};

const validateSQL = async (usuario_sql, base_sql, contrasena_sql, servidor_sql) => {
    try {
        const dbsettings = {
            user: usuario_sql,
            password: contrasena_sql,
            server: servidor_sql,
            database: base_sql,
            options: {
                trustServerCertificate: true,
                encrypt: false //for azure
            },
            port: 1433
        };

        const pool = new sql.ConnectionPool(dbsettings);
        await pool.connect();

        let ret = {
            valid: true,
            info: null,
            impuestos: null,
            bancos: null
        };
        const result = await pool
            .request()
            .query(queriesEmpresas.getSAPInfo);
        ret.info = result.recordset;

        const result2 = await pool
            .request()
            .query(queriesEmpresas.getSAPImpuestos);
        ret.impuestos = result2.recordset;

        const result3 = await pool
            .request()
            .query(queriesEmpresas.getBancos);
        let bancos = result3.recordset;

        for (let i = 0; i < bancos.length; i++) {
            const result4 = await pool
                .request()
                .input('CountryCod', sql.VarChar, bancos[i].CountryCod)
                .input('BankCode', sql.VarChar, bancos[i].BankCode)
                .query(queriesEmpresas.getCuentas);
            bancos[i].cuentas = result4.recordset;
        }

        ret.bancos = bancos;

        return ret;
    } catch (err) {
        return { valid: false, err: err };
    }
};

const existeEmpresa = async (base_sql, servidor_sql) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('base_sql', sql.VarChar, base_sql)
            .input('servidor_sql', sql.VarChar, servidor_sql)
            .query(queriesEmpresas.checkEmpresa);
        return result.recordset[0].id;
    } catch (err) {
        return -1;
    }
};

const validateLicencia = async (
    servidor_licencias,
    base_sql,
    usuario_sap,
    contrasena_sap,
    usuario_sql,
    contrasena_sql,
    sap_db_type,
    servidor_sql
) => {

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
};

export const sendBankInfo = async (req, res) => {
    const {
        servidor_sql,
        bd_sap,
        sap_db_type,
        usuario_sql,
        contrasena_sql,
        usuario_sap,
        contrasena_sap,
        servidor_licencias,
    } = req.body;
    try {
        var axios = require('axios');

        var data = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <Login xmlns="http://tempuri.org/wsSalesQuotation/Service1">
              <DataBaseServer>${servidor_sql}</DataBaseServer>
              <DataBaseName>${bd_sap}</DataBaseName>
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
        console.log(config);

        const response = await axios(config);

        let xmlParser = require('xml2json');
        let r = JSON.parse(xmlParser.toJson(response.data));
        r = r["soap:Envelope"]["soap:Body"]["LoginResponse"]["LoginResult"];


        let ret;
        if (!r.includes("Error")) {
            let bankInfo = `<?xml version="1.0" encoding="utf-8"?>
            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                <soap12:Body>
                    <AddPurchaseOrder xmlns="http://tempuri.org/wsSalesQuotation/Service1">
                    <SessionID>${r}</SessionID>
                    <sXmlOrderObject><BOM xmlns='http://www.sap.com/SBO/DIS'><BO><AdmInfo><Object>oBankStatement</Object></AdmInfo><BankStatement xmlns="http://tempuri.org/wsSalesQuotation/Service1">
                    <BankAccountKey>1</BankAccountKey>
                    <BankStatementRows>
                        <BankStatementRow>
                            <ExternalCode>E1</ExternalCode>
                            <MultiplePayments>
                                <MultiplePayment>
                                    <AmountLC>20</AmountLC>
                                    <IsDebit>tYes</IsDebit>
                                </MultiplePayment>
                            </MultiplePayments>
                        </BankStatementRow>
                    </BankStatementRows>
                </BankStatement></BO></BOM></sXmlOrderObject>
                    </AddPurchaseOrder>
                </soap12:Body>
            </soap12:Envelope>`;

            var config = {
                method: 'post',
                url: `http://${servidor_licencias}/wsSalesQuotation/DiServerServices.asmx?WSDL`,
                headers: {
                    'Content-Type': 'application/soap+xml'
                },
                data: bankInfo
            };

            console.log(config);

            const response = await axios(config);

            let xmlParser = require('xml2json');
            let r2 = JSON.parse(xmlParser.toJson(response.data));
            console.log(r2);


            ret = {
                valid: !r.includes("Error"),
                msg: r
            };
        } else {
            ret = {
                valid: !r.includes("Error"),
                msg: r
            };
        }


        res.json(ret);
    } catch (err) {
        res.json({ valid: false, err: err });
    }
};