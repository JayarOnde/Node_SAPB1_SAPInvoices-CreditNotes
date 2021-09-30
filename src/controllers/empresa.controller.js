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

export const updateEmpresaById = async (req, res) => {
    // const { nombre, email, password, supervisor, empresas, roles } = req.body;
    const { id } = req.params;

    let ex = await existeEmpresa(req.body.base_sql, req.body.servidor_sql);

    console.log(ex,id);
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
            console.log(bancos[i].CountryCod);
            console.log(bancos[i].BankCode);
            console.log(result4);
            bancos[i].cuentas = result4.recordset;
        }

        ret.bancos = bancos;

        res.json(ret);
    } catch (err) {
        res.json({ valid: false, err: err });
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
        return 0;
    }
};