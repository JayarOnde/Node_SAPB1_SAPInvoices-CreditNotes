/**
 * TODO
 * Validar que el registro no deje dos emails
 */

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
    const { nombre, email, password } = req.body;

    if (typeof (nombre) === 'undefined' || typeof (email) === 'undefined' || typeof (password) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    // Encrypt the password
    let pass = cryptPassword(password);

    // We make the insert and catch if any errors
    try {
        const pool = await getConnection();
        pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, pass)
            .query(queries.addNewUser);


        res.json("newproduct");
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
            .input('id', sql.Int, id)
            .query(queries.getUserById);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(queries.deleteProductById);
        res.sendStatus(204);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateUserById = async (req, res) => {
    const { nombre, email, password } = req.body;
    const { id } = req.params;

    if (typeof (nombre) === 'undefined' || typeof (email) === 'undefined') {
        return res.status(400).json({ msg: 'Debe de incluir todos los campos requeridos' });
    }

    if (typeof (password) !== 'undefined') {
        // Encrypt the password
        let pass = cryptPassword(password);

        try {
            const pool = await getConnection();
            await pool
                .request()
                .input('nombre', sql.VarChar, nombre)
                .input('email', sql.VarChar, email)
                .input('password', sql.VarChar, pass)
                .input('id', id)
                .query(queries.updateUserById);
            res.json({ nombre });
        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
    } else {
        try {
            const pool = await getConnection();
            await pool
                .request()
                .input('nombre', sql.VarChar, nombre)
                .input('email', sql.VarChar, email)
                .input('id', id)
                .query(queries.updateUserNoPassById);
            res.json({ nombre });
        } catch (err) {
            res.status(500);
            res.send(err.message);
        }
    }
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

        let r = result.recordset[0];
        if (comparePassword(password, r.password)) {
            res.status(200);
            res.json(result.recordset[0]);
        }else{
            res.json({ msg: "Usuario y/o contraseña incorrectas" });
        }
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};