/**
 * TODO
 * Validar que el registro no deje dos emails
 */

import { getConnection, variousQueries } from '../database';

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

