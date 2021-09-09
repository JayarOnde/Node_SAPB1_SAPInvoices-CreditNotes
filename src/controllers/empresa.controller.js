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

