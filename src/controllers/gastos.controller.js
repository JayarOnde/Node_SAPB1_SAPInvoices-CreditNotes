import sql from 'mssql';
import { getConnection, queriesGastos } from '../database';

export const getGastosGrupo = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(queriesGastos.getGastosGrupo);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getGastos = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(queriesGastos.getAllGastos);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getGastosById = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(queriesGastos.getGastosById);
        let gastos = result.recordset[0];

        // Get user roles
        const sub = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(queriesGastos.getSubGastos);

        gastos.sub = sub.recordset;

        res.json(gastos);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const deleteGastoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(queriesGastos.deleteGastoById);

        res.json({ msg: "Gasto eliminado exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateGastoById = async (req, res) => {
    const {
        descripcion,
        au_gasto_grupo_id,
        au_gasto_grupo_nombre,
        depreciacion,
        control_combustible,
        control_kilometraje,
        lleva_subgastos,
        exento_codigo,
        exento_nombre,
        afecto_codigo,
        afecto_nombre,
        remanente_codigo,
        remanente_nombre,
        exento_impuesto_codigo,
        exento_impuesto_nombre,
        afecto_impuesto_codigo,
        afecto_impuesto_nombre,
        remanente_impuesto_codigo,
        remanente_impuesto_nombre,
        sub,
        empresa_codigo,
        empresa_nombre
    } = req.body;

    const { id } = req.params;

    if (typeof (descripcion) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    let pool;
    try {
        pool = await getConnection();
        await pool
            .request()
            .input('descripcion', sql.VarChar, descripcion)
            .input('empresa_codigo', sql.BigInt, empresa_codigo)
            .input('empresa_nombre', sql.VarChar, empresa_nombre)
            .input('au_gasto_grupo_id', sql.BigInt, au_gasto_grupo_id)
            .input('au_gasto_grupo_nombre', sql.VarChar, au_gasto_grupo_nombre)
            .input('depreciacion', sql.TinyInt, depreciacion)
            .input('control_combustible', sql.TinyInt, control_combustible)
            .input('control_kilometraje', sql.TinyInt, control_kilometraje)
            .input('lleva_subgastos', sql.TinyInt, lleva_subgastos)
            .input('exento_codigo', sql.VarChar, exento_codigo)
            .input('exento_nombre', sql.VarChar, exento_nombre)
            .input('afecto_codigo', sql.VarChar, afecto_codigo)
            .input('afecto_nombre', sql.VarChar, afecto_nombre)
            .input('remanente_codigo', sql.VarChar, remanente_codigo)
            .input('remanente_nombre', sql.VarChar, remanente_nombre)
            .input('exento_impuesto_codigo', sql.VarChar, exento_impuesto_codigo)
            .input('exento_impuesto_nombre', sql.VarChar, exento_impuesto_nombre)
            .input('afecto_impuesto_codigo', sql.VarChar, afecto_impuesto_codigo)
            .input('afecto_impuesto_nombre', sql.VarChar, afecto_impuesto_nombre)
            .input('remanente_impuesto_codigo', sql.VarChar, remanente_impuesto_codigo)
            .input('remanente_impuesto_nombre', sql.VarChar, remanente_impuesto_nombre)
            .input('id', id)
            .query(queriesGastos.updateGastoById);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    /************************************************************************
     * Add sub gastos functionality
     ************************************************************************/
    // Delete the sub gastos
    let rd = await pool.request()
        .input('id', sql.BigInt, id)
        .query(queriesGastos.deleteGastosUsuario);

    // We add the roles
    for (let i = 0; i < sub.length; i++) {
        await pool.request()
            .input('descripcion', sql.VarChar, sub[i].descripcion)
            .input('exento', sql.TinyInt, sub[i].exento)
            .input('tipo', sql.VarChar, sub[i].tipo)
            .input('valor', sql.VarChar, sub[i].valor)
            .input('au_gasto_id', sql.BigInt, id)
            .query(queriesGastos.addSubGasto);
    }
    /************************************************************************
     * Add sub gastos functionality
     ************************************************************************/

    res.json({ msg: "Gasto actualizado con éxito!" });
};
export const addNewGasto = async (req, res) => {
    const {
        descripcion,
        au_gasto_grupo_id,
        au_gasto_grupo_nombre,
        depreciacion,
        control_combustible,
        control_kilometraje,
        lleva_subgastos,
        exento_codigo,
        exento_nombre,
        afecto_codigo,
        afecto_nombre,
        remanente_codigo,
        remanente_nombre,
        exento_impuesto_codigo,
        exento_impuesto_nombre,
        afecto_impuesto_codigo,
        afecto_impuesto_nombre,
        remanente_impuesto_codigo,
        remanente_impuesto_nombre,
        sub,
        empresa_codigo,
        empresa_nombre
    } = req.body;

    if (typeof (descripcion) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('empresa_codigo', sql.BigInt, empresa_codigo)
            .input('empresa_nombre', sql.VarChar, empresa_nombre)
            .input('descripcion', sql.VarChar, descripcion)
            .input('au_gasto_grupo_id', sql.BigInt, au_gasto_grupo_id)
            .input('au_gasto_grupo_nombre', sql.VarChar, au_gasto_grupo_nombre)
            .input('depreciacion', sql.TinyInt, depreciacion)
            .input('control_combustible', sql.TinyInt, control_combustible)
            .input('control_kilometraje', sql.TinyInt, control_kilometraje)
            .input('lleva_subgastos', sql.TinyInt, lleva_subgastos)
            .input('exento_codigo', sql.VarChar, exento_codigo)
            .input('exento_nombre', sql.VarChar, exento_nombre)
            .input('afecto_codigo', sql.VarChar, afecto_codigo)
            .input('afecto_nombre', sql.VarChar, afecto_nombre)
            .input('remanente_codigo', sql.VarChar, remanente_codigo)
            .input('remanente_nombre', sql.VarChar, remanente_nombre)
            .input('exento_impuesto_codigo', sql.VarChar, exento_impuesto_codigo)
            .input('exento_impuesto_nombre', sql.VarChar, exento_impuesto_nombre)
            .input('afecto_impuesto_codigo', sql.VarChar, afecto_impuesto_codigo)
            .input('afecto_impuesto_nombre', sql.VarChar, afecto_impuesto_nombre)
            .input('remanente_impuesto_codigo', sql.VarChar, remanente_impuesto_codigo)
            .input('remanente_impuesto_nombre', sql.VarChar, remanente_impuesto_nombre)
            .query(queriesGastos.addNewGasto);
        const id = result.recordset[0].id;

        /************************************************************************
         * Add sub gastos functionality
         ************************************************************************/
        // Delete the sub gastos
        let rd = await pool.request()
            .input('id', sql.BigInt, id)
            .query(queriesGastos.deleteGastosUsuario);

        // We add the roles
        for (let i = 0; i < sub.length; i++) {
            await pool.request()
                .input('descripcion', sql.VarChar, sub[i].descripcion)
                .input('exento', sql.TinyInt, sub[i].exento)
                .input('tipo', sql.VarChar, sub[i].tipo)
                .input('valor', sql.VarChar, sub[i].valor)
                .input('au_gasto_id', sql.BigInt, id)
                .query(queriesGastos.addSubGasto);
        }
        /************************************************************************
         * Add sub gastos functionality
         ************************************************************************/
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "Gasto creado con éxito!" });
};