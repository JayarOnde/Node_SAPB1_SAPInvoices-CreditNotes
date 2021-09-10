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
    getEmpresaById: 'select * from au_empresa where id=@id',
    deleteProductById: 'delete from au_empresa where id=@id',
    updateEmpresaById: `update au_empresa 
                            set 
                                nombre=@nombre,
                                servidor_licencias=@servidor_licencias,
                                usuario_sap=@usuario_sap,
                                contrasena_sap=@contrasena_sap,
                                segundos_espera=@segundos_espera,
                                ruta_archivos=@ruta_archivos,
                                usuario_sql=@usuario_sql,
                                sap_db_type=@sap_db_type,
                                contrasena_sql=@contrasena_sql,
                                servidor_sql=@servidor_sql,
                                codigo_empresa=@codigo_empresa,
                                moneda_local=@moneda_local,
                                moneda_extranjera=@moneda_extranjera,
                                dias_atraso_facturacion_ruta=@dias_atraso_facturacion_ruta,
                                valor_impuesto=@valor_impuesto,
                                dias_atraso_facturacion_gastos=@dias_atraso_facturacion_gastos,
                                no_identificacion_fiscal=@no_identificacion_fiscal,
                                dia_efectivo_ajuste=@dia_efectivo_ajuste,
                                remanente_nota_credito=@remanente_nota_credito,
                                maneja_xml=@maneja_xml,
                                ajuste_fin_mes=@ajuste_fin_mes,
                                control_numero_factura=@control_numero_factura
                            where 
                            id=@id`,
    addNewEmpresa: 'insert into au_empresa (nombre,servidor_licencias,usuario_sap,contrasena_sap,segundos_espera,ruta_archivos,usuario_sql,sap_db_type,contrasena_sql,servidor_sql,codigo_empresa,moneda_local,moneda_extranjera,dias_atraso_facturacion_ruta,valor_impuesto,dias_atraso_facturacion_gastos,no_identificacion_fiscal,dia_efectivo_ajuste,remanente_nota_credito,maneja_xml,ajuste_fin_mes,control_numero_factura) values(@nombre,@servidor_licencias,@usuario_sap,@contrasena_sap,@segundos_espera,@ruta_archivos,@usuario_sql,@sap_db_type,@contrasena_sql,@servidor_sql,@codigo_empresa,@moneda_local,@moneda_extranjera,@dias_atraso_facturacion_ruta,@valor_impuesto,@dias_atraso_facturacion_gastos,@no_identificacion_fiscal,@dia_efectivo_ajuste,@remanente_nota_credito,@maneja_xml,@ajuste_fin_mes,@control_numero_factura)'
}

export const queriesSAP = {
    getProveedoresSAP: 'select CardCode value,CardName label from OCRD',
    getUsuariosSAP: 'select SlpCode value,SlpName label from OSLP'
}