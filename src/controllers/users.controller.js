import sql from 'mssql';
import { cryptPassword, comparePassword } from './encrypt.passwords';
import { getConnection, queries } from '../database';

export const getUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(queries.getAllUsers);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const countUsers = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(queries.countUsers);
        res.json(result.recordset[0]['']);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const createNewUser = async (req, res) => {
    const { nombre, email, password, supervisor, empresas, roles,presupuestos } = req.body;

    if (typeof (nombre) === 'undefined' || typeof (email) === 'undefined' || typeof (password) === 'undefined' || typeof (supervisor) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    // Encrypt the password
    let pass = cryptPassword(password);

    // We make the insert and catch if any errors
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, pass)
            .input('sup', sql.BigInt, supervisor.value)
            .query(queries.addNewUser);

        const user_id = result.recordset[0].id;

        /************************************************************************
         * Add roles functionality
         ************************************************************************/
        // Delete the roles
        let rd = await pool.request()
            .input('id', sql.BigInt, user_id)
            .query(queries.deleteRolesUsuario);

        // We add the roles
        for (let i = 0; i < roles.length; i++) {
            await pool.request()
                .input('rol', sql.BigInt, roles[i].value)
                .input('usuario', sql.BigInt, user_id)
                .query(queries.addRol);
        }
        /************************************************************************
         * Add roles functionality
         ************************************************************************/

        /************************************************************************
         * Add presupuestos functionality
         ************************************************************************/
        // Delete the roles
        rd = await pool.request()
            .input('id', sql.BigInt, user_id)
            .query(queries.deletePresupuestosUsuario);

        // We add the roles
        for (let i = 0; i < presupuestos.length; i++) {
            await pool.request()
                .input('presupuesto', sql.BigInt, presupuestos[i].value)
                .input('usuario', sql.BigInt, user_id)
                .query(queries.addPresupuesto);
        }
        /************************************************************************
         * Add presupuestos functionality
         ************************************************************************/

        /************************************************************************
         * Add empresas functionality
         ************************************************************************/
        // Delete the empresas
        await pool.request()
            .input('id', sql.BigInt, user_id)
            .query(queries.deleteEmpresasUsuario);
        // We add the empresas
        for (let i = 0; i < empresas.length; i++) {
            await pool.request()
                .input('usuario', sql.BigInt, user_id)
                .input('empresa', sql.BigInt, empresas[i].au_empresa_id)
                .input('codigo_proveedor', sql.VarChar, empresas[i].codigo_proveedor_sap)
                .input('nombre_proveedor', sql.VarChar, empresas[i].nombre_proveedor_sap)
                .input('codigo_usuario', sql.VarChar, empresas[i].codigo_usuario_sap)
                .input('nombre_usuario', sql.VarChar, empresas[i].nombre_usuario_sap)
                .query(queries.addEmpresa);
        }
        /************************************************************************
         * Add empresas functionality
         ************************************************************************/


        res.json({ msg: "¡Usuario creado con éxito!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
}


export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(queries.getUserById);

        let user = result.recordset[0];

        // Get user roles
        const roles = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(queries.getRolesUsuario);

        user.roles = roles.recordset;

        // Get user empresas
        const empresas = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(queries.getEmpresasUsuario);

        user.empresas = empresas.recordset;

        // Get user presupuestos
        const presupuestos = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(queries.getPresupuestosUsuario);

        user.presupuestos = presupuestos.recordset;

        res.json(user);


        // ret = "";
        // res.json(ret);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(queries.deleteProductById);

        // Delete the roles
        await pool.request()
            .input('id', sql.BigInt, id)
            .query(queries.deleteRolesUsuario);
        // Delete the empresas
        await pool.request()
            .input('id', sql.BigInt, id)
            .query(queries.deleteEmpresasUsuario);

        res.json({ msg: "¡Usuario eliminado exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateUserById = async (req, res) => {
    const { nombre, email, password, supervisor, empresas, roles, presupuestos } = req.body;
    const { id } = req.params;

    if (typeof (nombre) === 'undefined' || typeof (email) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    let pool;
    if (typeof (password) !== 'undefined') {
        // Encrypt the password
        let pass = cryptPassword(password);

        try {
            pool = await getConnection();
            await pool
                .request()
                .input('nombre', sql.VarChar, nombre)
                .input('email', sql.VarChar, email)
                .input('password', sql.VarChar, pass)
                .input('sup', sql.BigInt, supervisor.value)
                .input('id', id)
                .query(queries.updateUserById);
        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
    } else {
        try {
            pool = await getConnection();
            await pool
                .request()
                .input('nombre', sql.VarChar, nombre)
                .input('email', sql.VarChar, email)
                .input('sup', sql.BigInt, supervisor.value)
                .input('id', id)
                .query(queries.updateUserNoPassById);
        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
    }

    /************************************************************************
     * Add roles functionality
     ************************************************************************/
    // Delete the roles
    let rd = await pool.request()
        .input('id', sql.BigInt, id)
        .query(queries.deleteRolesUsuario);

    // We add the roles
    for (let i = 0; i < roles.length; i++) {
        await pool.request()
            .input('rol', sql.BigInt, roles[i].value)
            .input('usuario', sql.BigInt, id)
            .query(queries.addRol);
    }
    /************************************************************************
     * Add roles functionality
     ************************************************************************/

    /************************************************************************
     * Add presupuestos functionality
     ************************************************************************/
    // Delete the roles
    rd = await pool.request()
        .input('id', sql.BigInt, id)
        .query(queries.deletePresupuestosUsuario);

    // We add the roles
    for (let i = 0; i < presupuestos.length; i++) {
        await pool.request()
            .input('presupuesto', sql.BigInt, presupuestos[i].value)
            .input('usuario', sql.BigInt, id)
            .query(queries.addPresupuesto);
    }
    /************************************************************************
     * Add presupuestos functionality
     ************************************************************************/

    /************************************************************************
     * Add empresas functionality
     ************************************************************************/
    // Delete the empresas
    await pool.request()
        .input('id', sql.BigInt, id)
        .query(queries.deleteEmpresasUsuario);
    // We add the empresas
    for (let i = 0; i < empresas.length; i++) {
        await pool.request()
            .input('usuario', sql.BigInt, id)
            .input('empresa', sql.BigInt, empresas[i].au_empresa_id)
            .input('codigo_proveedor', sql.VarChar, empresas[i].codigo_proveedor_sap)
            .input('nombre_proveedor', sql.VarChar, empresas[i].nombre_proveedor_sap)
            .input('codigo_usuario', sql.VarChar, empresas[i].codigo_usuario_sap)
            .input('nombre_usuario', sql.VarChar, empresas[i].nombre_usuario_sap)
            .query(queries.addEmpresa);
    }
    /************************************************************************
     * Add empresas functionality
     ************************************************************************/

    res.json({ msg: "¡Usuario actualizado con éxito!" });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (typeof (email) === 'undefined' || typeof (password) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('email', sql.VarChar, email)
            .query(queries.login);

        if (result.recordset.length > 0) {
            let r = result.recordset[0];
            if (comparePassword(password, r.password)) {
                res.status(200);
                res.json({
                    id: result.recordset[0].id,
                    nombre: result.recordset[0].nombre
                });
            } else {
                res.status(400);
                res.json({ msg: "Usuario y/o contraseña incorrectas" });
            }
        } else {
            res.status(404);
            res.json({ msg: "Usuario no existe en nuestro sistema." });
        }
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};