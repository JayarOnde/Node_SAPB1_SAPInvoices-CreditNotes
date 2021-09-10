import sql from 'mssql';
import { getConnection, bancosQueries } from '../database';

export const getBancos = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(bancosQueries.getBancos);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getBancoById = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(bancosQueries.getBancoById);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateBancoById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('codigo_banco_sap', sql.VarChar, req.body.codigo_banco_sap)
            .input('codigo_banco_file', sql.VarChar, req.body.codigo_banco_file)
            .input('ruta_archivos', sql.VarChar, req.body.ruta_archivos)
            .input('au_empresa_id', sql.BigInt, req.body.empresa.value)
            .input('id', id)
            .query(bancosQueries.updateBancoById);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "¡Banco actualizado con éxito!" });
};

export const addNewBanco = async (req, res) => {
    // const { nombre, email, password, supervisor, empresas, roles } = req.body;
    console.log(req.body);
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('codigo_banco_sap', sql.VarChar, req.body.codigo_banco_sap)
            .input('codigo_banco_file', sql.VarChar, req.body.codigo_banco_file)
            .input('ruta_archivos', sql.VarChar, req.body.ruta_archivos)
            .input('au_empresa_id', sql.BigInt, req.body.empresa.value)
            .input('id', id)
            .query(bancosQueries.addNewBanco);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "¡Banco creado con éxito!" });
};

export const deleteBancoById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(bancosQueries.deleteBancoById);

        res.json({ msg: "¡Banco eliminado exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};


/**
 * Cuentas
 */
export const getCuentas = async (req, res) => {
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .query(bancosQueries.getCuentas);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getCuentasById = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(bancosQueries.getCuentasById);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateCuentaById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('numero_cuenta', sql.VarChar, req.body.numero_cuenta)
            .input('numero_cuenta_sap', sql.VarChar, req.body.numero_cuenta_sap)
            .input('au_banco_id', sql.BigInt, req.body.banco.value)
            .input('au_empresa_id', sql.BigInt, req.body.empresa.value)
            .input('id', id)
            .query(bancosQueries.updateCuentaById);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "¡Cuenta actualizada con éxito!" });
};

export const addNewCuenta = async (req, res) => {
    // const { nombre, email, password, supervisor, empresas, roles } = req.body;
    console.log(req.body);
    const { id } = req.params;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('numero_cuenta', sql.VarChar, req.body.numero_cuenta)
            .input('numero_cuenta_sap', sql.VarChar, req.body.numero_cuenta_sap)
            .input('au_banco_id', sql.BigInt, req.body.banco.value)
            .input('au_empresa_id', sql.BigInt, req.body.empresa.value)
            .input('id', id)
            .query(bancosQueries.addNewCuenta);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "¡Cuenta creada con éxito!" });
};

export const deleteCuentaById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(bancosQueries.deleteCuentaById);

        res.json({ msg: "¡Cuenta eliminada exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};