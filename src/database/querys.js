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
    deleteEmpresaById: 'delete from au_empresa where id=@id',
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
                                base_sql=@base_sql,
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
                                bd_sap=@bd_sap,
                                label_impuesto=@label_impuesto,
                                sap_db_type_label=@sap_db_type_label,
                                control_numero_factura=@control_numero_factura,
                                bancos=@bancos
                            where 
                            id=@id`,
    addNewEmpresa: `insert into au_empresa (nombre,servidor_licencias,usuario_sap,contrasena_sap,segundos_espera,ruta_archivos,usuario_sql,sap_db_type,contrasena_sql,servidor_sql,base_sql,moneda_local,moneda_extranjera,dias_atraso_facturacion_ruta,valor_impuesto,dias_atraso_facturacion_gastos,no_identificacion_fiscal,dia_efectivo_ajuste,remanente_nota_credito,maneja_xml,ajuste_fin_mes,control_numero_factura,bd_sap,sap_db_type_label,label_impuesto,bancos) 
                    values(@nombre,@servidor_licencias,@usuario_sap,@contrasena_sap,@segundos_espera,@ruta_archivos,@usuario_sql,@sap_db_type,@contrasena_sql,@servidor_sql,@base_sql,@moneda_local,@moneda_extranjera,@dias_atraso_facturacion_ruta,@valor_impuesto,@dias_atraso_facturacion_gastos,@no_identificacion_fiscal,@dia_efectivo_ajuste,@remanente_nota_credito,@maneja_xml,@ajuste_fin_mes,@control_numero_factura,@bd_sap,@sap_db_type_label,@label_impuesto,@bancos)`,
    getSAPInfo: 'select CompnyName,MainCurncy,SysCurrncy,TaxIdNum from OADM',
    getSAPImpuestos: `select
                            Code + ' - ' + Name + ' (' + CAST ( CAST( Rate AS DECIMAL(16,2)) as varchar ) + ')' label,
                            Rate value
                        from
                            OSTA`,
    checkEmpresa: `select   id
                    from    au_empresa
                    where   base_sql=@base_sql
                    and     servidor_sql=@servidor_sql`,
    getBancos: `select
                    BankCode,
                    BankName,
                    CountryCod,
                    AbsEntry
                from
                    ODSC`,
    getCuentas: `select
                    Country,
                    BankCode,
                    Account,
                    GLAccount
                from
                    DSC1
                where
                    Country=@CountryCod
                and
                    BankCode=@BankCode`
}

export const bancosQueries = {
    getBancos: 'select id value,nombre label from au_banco',
    getBancoById: 'select b.*,e.id id_empresa,e.nombre empresa from au_banco b left join au_empresa e on b.au_empresa_id=e.id where b.id=@id',
    updateBancoById: 'update au_banco set nombre=@nombre, codigo_banco_sap=@codigo_banco_sap, codigo_banco_file=@codigo_banco_file, ruta_archivos=@ruta_archivos, au_empresa_id=@au_empresa_id where id=@id',
    addNewBanco: 'insert into au_banco (nombre,codigo_banco_sap,codigo_banco_file,ruta_archivos,au_empresa_id) values (@nombre,@codigo_banco_sap,@codigo_banco_file,@ruta_archivos,@au_empresa_id);',
    deleteBancoById: 'delete from au_banco where id=@id',
    getCuentas: 'select c.id value,c.numero_cuenta label, b.nombre banco from au_cuenta_bancos c left join au_banco b on c.au_banco_id=b.id',
    getCuentasById: 'select c.*,e.id id_empresa,e.nombre empresa,b.id id_banco, b.nombre banco from au_cuenta_bancos c left join au_empresa e on c.au_empresa_id=e.id left join au_banco b on c.au_banco_id=b.id where c.id=@id',
    deleteCuentaById: 'delete from au_cuenta_bancos where id=@id',
    updateCuentaById: 'update au_cuenta_bancos set au_empresa_id=@au_empresa_id, au_banco_id=@au_banco_id, numero_cuenta=@numero_cuenta, numero_cuenta_sap=@numero_cuenta_sap where id=@id',
    addNewCuenta: 'insert into au_cuenta_bancos (au_empresa_id,au_banco_id,numero_cuenta,numero_cuenta_sap) values (@au_empresa_id,@au_banco_id,@numero_cuenta,@numero_cuenta_sap);',
}

export const queriesSAP = {
    getProveedoresSAP: 'select CardCode value,CardName label from OCRD',
    getUsuariosSAP: 'select SlpCode value,SlpName label from OSLP',
    getCuentasContables: `SELECT
                            value		=	Case when levels = 1 then
                                                LEFT(AcctCode,1)
                                            when Postable = 'Y' then
                                                Segment_0
                                            else
                                                AcctCode
                                            end
                        ,	label =	AcctName
                        FROM
                            OACT
                        where
                            Postable = 'Y'
                        ORDER BY
                            GroupMask,
                            GrpLine`,
    getImpuestos: `select
                        Code + ' - ' + Name + ' (' + CAST ( CAST( Rate AS DECIMAL(16,2)) as varchar ) + ')' label,
                        Rate value
                    from
                        OSTA`,
}
export const queriesGastos = {
    getAllGastos: 'select id value,descripcion label from au_gasto',
    getGastosGrupo: 'select id value,nombre label from au_gasto_grupo',
    getGastosById: 'select * from au_gasto where id=@id',
    getSubGastos: 'select * from au_sub_gasto where au_gasto_id=@id',
    deleteGastoById: 'delete from au_gasto where id=@id',
    updateGastoById: `update au_gasto 
                        set descripcion=@descripcion, 
                        au_gasto_grupo_id=@au_gasto_grupo_id,
                        au_gasto_grupo_nombre=@au_gasto_grupo_nombre,
                        depreciacion=@depreciacion,
                        control_combustible=@control_combustible,
                        control_kilometraje=@control_kilometraje,
                        exento_codigo=@exento_codigo,
                        exento_nombre=@exento_nombre,
                        afecto_codigo=@afecto_codigo,
                        afecto_nombre=@afecto_nombre,
                        remanente_codigo=@remanente_codigo,
                        remanente_nombre=@remanente_nombre,
                        exento_impuesto_codigo=@exento_impuesto_codigo,
                        exento_impuesto_nombre=@exento_impuesto_nombre,
                        afecto_impuesto_codigo=@afecto_impuesto_codigo,
                        afecto_impuesto_nombre=@afecto_impuesto_nombre,
                        remanente_impuesto_codigo=@remanente_impuesto_codigo,
                        remanente_impuesto_nombre=@remanente_impuesto_nombre,
                        empresa_codigo=@empresa_codigo,
                        empresa_nombre=@empresa_nombre
                        where id=@id`,
    deleteGastosUsuario: 'delete from au_sub_gasto where au_gasto_id= @id;',
    addSubGasto: 'insert into au_sub_gasto (descripcion,au_gasto_id,exento,tipo,valor) values(@descripcion,@au_gasto_id,@exento,@tipo,@valor);',
    addNewGasto: `insert into au_gasto (empresa_codigo,empresa_nombre,descripcion,au_gasto_grupo_id,au_gasto_grupo_nombre,depreciacion,control_combustible,control_kilometraje,exento_codigo,exento_nombre,afecto_codigo,afecto_nombre,remanente_codigo,remanente_nombre,exento_impuesto_codigo,exento_impuesto_nombre,afecto_impuesto_codigo,afecto_impuesto_nombre,remanente_impuesto_codigo,remanente_impuesto_nombre) 
                    values(@empresa_codigo,@empresa_nombre,@descripcion,@au_gasto_grupo_id,@au_gasto_grupo_nombre,@depreciacion,@control_combustible,@control_kilometraje,@exento_codigo,@exento_nombre,@afecto_codigo,@afecto_nombre,@remanente_codigo,@remanente_nombre,@exento_impuesto_codigo,@exento_impuesto_nombre,@afecto_impuesto_codigo,@afecto_impuesto_nombre,@remanente_impuesto_codigo,@remanente_impuesto_nombre);
                    SELECT SCOPE_IDENTITY() AS id;`,
}

export const presupuestoQueries = {
    getPresupuesto: `select id value,usuario_nombre + ' - ' + ruta_nombre label from au_presupuesto`,
    getBancoById: 'select b.*,e.id id_empresa,e.nombre empresa from au_banco b left join au_empresa e on b.au_empresa_id=e.id where b.id=@id',
    updateBancoById: 'update au_banco set nombre=@nombre, codigo_banco_sap=@codigo_banco_sap, codigo_banco_file=@codigo_banco_file, ruta_archivos=@ruta_archivos, au_empresa_id=@au_empresa_id where id=@id',
    addNewBanco: 'insert into au_banco (nombre,codigo_banco_sap,codigo_banco_file,ruta_archivos,au_empresa_id) values (@nombre,@codigo_banco_sap,@codigo_banco_file,@ruta_archivos,@au_empresa_id);',
    deleteBancoById: 'delete from au_banco where id=@id',
    getCuentas: 'select c.id value,c.numero_cuenta label, b.nombre banco from au_cuenta_bancos c left join au_banco b on c.au_banco_id=b.id',
    getCuentasById: 'select c.*,e.id id_empresa,e.nombre empresa,b.id id_banco, b.nombre banco from au_cuenta_bancos c left join au_empresa e on c.au_empresa_id=e.id left join au_banco b on c.au_banco_id=b.id where c.id=@id',
    deleteCuentaById: 'delete from au_cuenta_bancos where id=@id',
    updateCuentaById: 'update au_cuenta_bancos set au_empresa_id=@au_empresa_id, au_banco_id=@au_banco_id, numero_cuenta=@numero_cuenta, numero_cuenta_sap=@numero_cuenta_sap where id=@id',
    addNewCuenta: 'insert into au_cuenta_bancos (au_empresa_id,au_banco_id,numero_cuenta,numero_cuenta_sap) values (@au_empresa_id,@au_banco_id,@numero_cuenta,@numero_cuenta_sap);',
}