import { getConnection2, queriesSAP } from '../database';
import sql from 'mssql';

export const getProveedoresSAP = async (req, res) => {
    const { id } = req.params;
    try {
        const poolS = await getConnection2(id);
        const result = await poolS
            .request()
            .query(queriesSAP.getProveedoresSAP);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getUsuariosSAP = async (req, res) => {
    const { id } = req.params;
    try {
        const poolS = await getConnection2(id);
        const result = await poolS
            .request()
            .query(queriesSAP.getUsuariosSAP);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getCuentasContables = async (req, res) => {
    const { id } = req.params;
    try {
        const poolS = await getConnection2(id);
        const result = await poolS
            .request()
            .query(queriesSAP.getCuentasContables);
        let cuentas = result.recordset;

        for (let i = 0; i < cuentas.length; i++) {
            cuentas[i].isDisabled = cuentas[i].Postable !== 'Y';
        }

        res.json(cuentas);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getImpuestos = async (req, res) => {
    const { id } = req.params;
    try {
        const poolS = await getConnection2(id);
        const result = await poolS
            .request()
            .query(queriesSAP.getImpuestos);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getProyectos = async (req, res) => {
    const { id } = req.params;
    try {
        const poolS = await getConnection2(id);
        const result = await poolS
            .request()
            .query(queriesSAP.getProyectos);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getCentrosCosto = async (req, res) => {
    const { id } = req.params;
    try {
        let ret = [];
        const poolS = await getConnection2(id);
        const result1 = await poolS
            .request()
            .input('id', sql.Int, 1)
            .query(queriesSAP.getCentrosCosto);
        ret.push(result1.recordset);

        const result2 = await poolS
            .request()
            .input('id', sql.Int, 2)
            .query(queriesSAP.getCentrosCosto);
        ret.push(result2.recordset);

        const result3 = await poolS
            .request()
            .input('id', sql.Int, 3)
            .query(queriesSAP.getCentrosCosto);
        ret.push(result3.recordset);

        const result4 = await poolS
            .request()
            .input('id', sql.Int, 4)
            .query(queriesSAP.getCentrosCosto);
        ret.push(result4.recordset);

        const result5 = await poolS
            .request()
            .input('id', sql.Int, 5)
            .query(queriesSAP.getCentrosCosto);
        ret.push(result5.recordset);

        res.json(ret);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

