import { getConnection2, queriesSAP } from '../database';

export const getProveedoresSAP = async (req, res) => {
    try {
        const poolS = await getConnection2();
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
    try {
        const poolS = await getConnection2();
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
    try {
        const poolS = await getConnection2();
        const result = await poolS
            .request()
            .query(queriesSAP.getCuentasContables);
        let cuentas = result.recordset;

        for(let i=0;i<cuentas.length;i++){
            cuentas[i].isDisabled = cuentas[i].Postable !=='Y';
        }

        res.json(cuentas);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getImpuestos = async (req, res) => {
    try {
        const poolS = await getConnection2();
        const result = await poolS
            .request()
            .query(queriesSAP.getImpuestos);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

