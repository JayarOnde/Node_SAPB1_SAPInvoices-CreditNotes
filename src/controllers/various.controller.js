/**
 * TODO
 * Validar que el registro no deje dos emails
 */

import { getConnection, variousQueries } from '../database';
import sql from 'mssql';

export const getRoles = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(variousQueries.getRoles);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getProveedores = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(variousQueries.getProveedores);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const insertProveedor = async (req, res) => {
    const {
        nit,
        nombre,
        tipo_proveedor
    } = req.body;

    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .input('nit', sql.VarChar, nit)
            .query(variousQueries.proveedorExists);
        if (result.recordset.length > 0) {
            res.json({ res: -1 });
        } else {
            const result = await pool
                .request()
                .input('nit', sql.VarChar, nit)
                .input('nombre', sql.VarChar, nombre)
                .input('tipo_proveedor', sql.VarChar, tipo_proveedor)
                .query(variousQueries.insertProveedor);
            res.json(result.recordset);
        }


    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

