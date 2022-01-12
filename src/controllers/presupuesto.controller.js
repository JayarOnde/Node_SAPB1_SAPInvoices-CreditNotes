import sql from 'mssql';
import { getConnection, presupuestoQueries } from '../database';

export const getPresupuestos = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(presupuestoQueries.getPresupuesto);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getTipoGasto = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(presupuestoQueries.getTipoGasto);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getCategoriaGasto = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(presupuestoQueries.getCategoriaGasto);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getFrecuenciaGasto = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(presupuestoQueries.getFrecuenciaGasto);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getPresupuestoById = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(presupuestoQueries.getPresupuestoById);
        let prespuesto = result.recordset[0];

        // Get user roles
        const sub = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(presupuestoQueries.getDetallePresupuesto);
        prespuesto.sub = sub.recordset;
        res.json(prespuesto);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updatePresupuestoById = async (req, res) => {
    const {
        nombre,
        monto_maximo_factura,
        moneda_codigo,
        moneda_nombre,
        empresa_codigo,
        empresa_nombre,
        tipo_gasto_codigo,
        tipo_gasto_nombre,
        activo,
        sub
    } = req.body;

    const { id } = req.params;

    let pool;

    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('nombre', sql.VarChar, nombre)
            .input('monto_maximo_factura', sql.Numeric, monto_maximo_factura)
            .input('moneda_codigo', sql.VarChar, moneda_codigo)
            .input('moneda_nombre', sql.VarChar, moneda_nombre)
            .input('empresa_codigo', sql.BigInt, empresa_codigo)
            .input('empresa_nombre', sql.VarChar, empresa_nombre)
            .input('tipo_gasto_codigo', sql.Int, tipo_gasto_codigo)
            .input('tipo_gasto_nombre', sql.VarChar, tipo_gasto_nombre)
            .input('activo', sql.TinyInt, activo)
            .input('id', sql.BigInt, id)
            .query(presupuestoQueries.updatePresupuestoById);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
    /************************************************************************
     * Add detalle presupuesto functionality
     ************************************************************************/
    // Delete the sub gastos
    let rd = await pool.request()
        .input('id', sql.BigInt, id)
        .query(presupuestoQueries.deleteDetallePresupuesto);

    // We add the roles
    for (let i = 0; i < sub.length; i++) {
        await pool.request()
            .input('categoria_gasto_codigo', sql.VarChar, sub[i].categoria_gasto_codigo)
            .input('categoria_gasto_nombre', sql.VarChar, sub[i].categoria_gasto_nombre)
            .input('tipo_asignacion', sql.VarChar, sub[i].tipo_asignacion)
            .input('asignacion_cantidad', sql.Numeric, sub[i].asignacion_cantidad)
            .input('asignacion_medida', sql.VarChar, sub[i].asignacion_medida)
            .input('frecuencia_codigo', sql.VarChar, sub[i].frecuencia_codigo)
            .input('frecuencia_nombre', sql.VarChar, sub[i].frecuencia_nombre)
            .input('au_presupuesto_id', sql.BigInt, sub[i].au_presupuesto_id)

            .query(presupuestoQueries.addDetallePresupuesto);
    }
    /************************************************************************
     * Add detalle presupuesto functionality
     ************************************************************************/
    res.json({ msg: "Presupuesto actualizado con éxito!" });
};

export const addNewPresupuesto = async (req, res) => {
    const {
        nombre,
        monto_maximo_factura,
        moneda_codigo,
        moneda_nombre,
        empresa_codigo,
        empresa_nombre,
        tipo_gasto_codigo,
        tipo_gasto_nombre,
        activo,
        sub
    } = req.body;

    if (typeof (nombre) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('nombre', sql.VarChar, nombre)
            .input('monto_maximo_factura', sql.Numeric, monto_maximo_factura)
            .input('moneda_codigo', sql.VarChar, moneda_codigo)
            .input('moneda_nombre', sql.VarChar, moneda_nombre)
            .input('empresa_codigo', sql.BigInt, empresa_codigo)
            .input('empresa_nombre', sql.VarChar, empresa_nombre)
            .input('tipo_gasto_codigo', sql.Int, tipo_gasto_codigo)
            .input('tipo_gasto_nombre', sql.VarChar, tipo_gasto_nombre)
            .input('activo', sql.TinyInt, activo)
            .input('id', sql.BigInt, id)
            .query(presupuestoQueries.addNewPresupuesto);
        const id = result.recordset[0].id;

        /************************************************************************
         * Add detalle presupuesto functionality
         ************************************************************************/
        // Delete the sub gastos
        let rd = await pool.request()
            .input('id', sql.BigInt, id)
            .query(presupuestoQueries.deleteDetallePresupuesto);

        // We add the roles
        for (let i = 0; i < sub.length; i++) {
            await pool.request()
                .input('categoria_gasto_codigo', sql.VarChar, sub[i].categoria_gasto_codigo)
                .input('categoria_gasto_nombre', sql.VarChar, sub[i].categoria_gasto_nombre)
                .input('tipo_asignacion', sql.VarChar, sub[i].tipo_asignacion)
                .input('asignacion_cantidad', sql.Numeric, sub[i].asignacion_cantidad)
                .input('asignacion_medida', sql.VarChar, sub[i].asignacion_medida)
                .input('frecuencia_codigo', sql.VarChar, sub[i].frecuencia_codigo)
                .input('frecuencia_nombre', sql.VarChar, sub[i].frecuencia_nombre)
                .input('au_presupuesto_id', sql.BigInt, sub[i].au_presupuesto_id)

                .query(presupuestoQueries.addDetallePresupuesto);
        }
        /************************************************************************
         * Add detalle presupuesto functionality
         ************************************************************************/
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "¡Presupuesto creado con éxito!" });
};

export const deletePresupuestoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(presupuestoQueries.deletePresupuestoById);

        res.json({ msg: "¡Presupuesto eliminado exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};


export const getPresupuestosEmpresa = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.Int, id)
            .query(presupuestoQueries.getPresupuestosEmpresa);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getEmpresaPresupuesto = async (req, res) => {
    const { id } = req.params;
    console.log(id,presupuestoQueries.getEmpresaPresupuesto);
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.Int, id)
            .query(presupuestoQueries.getEmpresaPresupuesto);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};