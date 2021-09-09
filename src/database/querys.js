export const queries = {
    getAllUsers: 'select id value,nombre label,email from au_usuario',
    countUsers: 'select count(1) from au_usuario',
    addNewUser: 'insert into au_usuario (nombre,email,password,supervisor) values(@nombre,@email,@password,@sup);SELECT SCOPE_IDENTITY() AS id;',
    getRolesUsuario: 'select r.id value,r.nombre label from au_usuario_rol ur join au_rol r on ur.au_rol_id=r.id where au_usuario_id= @id;',
    deleteRolesUsuario: 'delete from au_usuario_rol where au_usuario_id= @id;',
    addRol: 'insert into au_usuario_rol (au_rol_id,au_usuario_id) values(@rol,@usuario);',
    getUserById: 'select u.*,s.nombre nombre_supervisor from au_usuario u left join au_usuario s on u.supervisor=s.id where u.id=@id',
    deleteProductById: 'delete from au_usuario where id=@id',
    updateUserById: 'update au_usuario set nombre=@nombre, email=@email, password=@password, supervisor=@sup where id=@id',
    updateUserNoPassById: 'update au_usuario set nombre=@nombre, email=@email, supervisor=@sup where id=@id',
    login: 'select id,nombre, password from au_usuario where email=@email',
    deleteEmpresasUsuario: 'delete from au_usuario_empresa where au_usuario_id= @id;',
    addEmpresa: 'insert into au_usuario_empresa (au_usuario_id,au_empresa_id,codigo_proveedor_sap,nombre_proveedor_sap,codigo_usuario_sap,nombre_usuario_sap) values(@usuario,@empresa,@codigo_proveedor,@nombre_proveedor,@codigo_usuario,@nombre_usuario);',
    getEmpresasUsuario: 'select ue.*,e.nombre nombre_empresa from au_usuario_empresa ue left join au_empresa e on ue.au_empresa_id=e.id where au_usuario_id= @id;'
}

export const variousQueries = {
    getRoles: 'select id value,nombre label from au_rol'
}

export const queriesEmpresas = {
    getAllEmpresas: 'select id value,nombre label from au_empresa',
    countUsers: 'select count(1) from au_usuario',
    addNewUser: 'insert into au_usuario (nombre,email,password) values(@nombre,@email,@password)',
    getUserById: 'select * from au_usuario where id=@id',
    deleteProductById: 'delete from au_usuario where id=@id',
    updateUserById: 'update au_usuario set nombre=@nombre, email=@email, password=@password where id=@id',
    updateUserNoPassById: 'update au_usuario set nombre=@nombre, email=@email where id=@id',
    login: 'select id,nombre, password from au_usuario where email=@email'
}

export const queriesSAP = {
    getProveedoresSAP: 'select CardCode value,CardName label from OCRD',
    getUsuariosSAP: 'select SlpCode value,SlpName label from OSLP'
}