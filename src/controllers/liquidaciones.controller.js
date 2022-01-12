import { getConnection, liquidacionesQueries } from '../database';
import sql from 'mssql';
export const getLiquidaciones = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(liquidacionesQueries.getLiquidaciones);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const addLiquidacion = async (req, res) => {
    const { au_usuario_id, au_gasto_id, fecha_inicio, fecha_fin, total_facturado, no_aplica, reembolso, comentario, au_gasto_label } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('au_usuario_id', sql.BigInt, au_usuario_id)
            .input('au_gasto_id', sql.BigInt, au_gasto_id)
            .input('au_gasto_label', sql.VarChar, au_gasto_label)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_fin', sql.Date, fecha_fin)
            .input('total_facturado', sql.Numeric, total_facturado)
            .input('no_aplica', sql.Numeric, no_aplica)
            .input('reembolso', sql.Numeric, reembolso)
            .input('comentario', sql.VarChar, comentario)
            .query(liquidacionesQueries.addLiquidacion);
        res.json(result.recordset[0].id);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getLiquidacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(liquidacionesQueries.getLiquidacionById);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateLiquidacionById = async (req, res) => {
    const { id } = req.params;
    const { au_usuario_id, au_gasto_id, fecha_inicio, fecha_fin, total_facturado, no_aplica, reembolso, comentario, au_gasto_label } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('au_usuario_id', sql.BigInt, au_usuario_id)
            .input('au_gasto_id', sql.BigInt, au_gasto_id)
            .input('au_gasto_label', sql.VarChar, au_gasto_label)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_fin', sql.Date, fecha_fin)
            .input('total_facturado', sql.Numeric, total_facturado)
            .input('no_aplica', sql.Numeric, no_aplica)
            .input('reembolso', sql.Numeric, reembolso)
            .input('comentario', sql.VarChar, comentario)
            .input('id', id)
            .query(liquidacionesQueries.updateLiquidacionById);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "Liquidación actualizada con éxito!" });
};

export const deleteLiquidacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(liquidacionesQueries.deleteLiquidacionById);

        res.json({ msg: "Liquidación eliminada exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};