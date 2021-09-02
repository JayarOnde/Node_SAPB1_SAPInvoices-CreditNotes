export const queries = {
    getAllUsers: 'select * from au_usuario',
    countUsers: 'select count(1) from au_usuario',
    addNewUser: 'insert into au_usuario (nombre,email,password) values(@nombre,@email,@password)',
    getUserById: 'select * from au_usuario where id=@id',
    deleteProductById: 'delete from au_usuario where id=@id',
    updateUserById: 'update au_usuario set nombre=@nombre, email=@email, password=@password where id=@id',
    updateUserNoPassById: 'update au_usuario set nombre=@nombre, email=@email where id=@id',
    login: 'select id,nombre, email, password from au_usuario where email=@email'
}