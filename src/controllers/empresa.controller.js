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
    console.log(req.body);
    const { id } = req.params;

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
            .input('codigo_empresa', sql.VarChar, req.body.codigo_empresa)
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
            .input('control_numero_factura', sql.TinyInt, req.body.control_numero_factura)
            .input('id', id)
            .query(queriesEmpresas.updateEmpresaById);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "¡Empresa actualizada con éxito!" });
};

export const addNewEmpresa = async (req, res) => {
    // const { nombre, email, password, supervisor, empresas, roles } = req.body;
    console.log(req.body);
    const { id } = req.params;

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
            .input('codigo_empresa', sql.VarChar, req.body.codigo_empresa)
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
            .input('control_numero_factura', sql.TinyInt, req.body.control_numero_factura)
            .input('id', id)
            .query(queriesEmpresas.addNewEmpresa);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "¡Empresa creada con éxito!" });
};