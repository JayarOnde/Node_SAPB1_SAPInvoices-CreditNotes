export const queries = {
    getAllUsers: 'select id value,nombre label,email from au_usuario',
    countUsers: 'select count(1) from au_usuario',
    addNewUser: 'insert into au_usuario (nombre,email,password,supervisor) values(@nombre,@email,@password,@sup);SELECT SCOPE_IDENTITY() AS id;',
    getRolesUsuario: 'select r.id value,r.nombre label from au_usuario_rol ur join au_rol r on ur.au_rol_id=r.id where au_usuario_id= @id;',
    deleteRolesUsuario: 'delete from au_usuario_rol where au_usuario_id= @id;',
    addRol: 'insert into au_usuario_rol (au_rol_id,au_usuario_id) values(@rol,@usuario);',
    getPresupuestosUsuario: 'select r.id value,r.nombre label from au_usuario_presupuesto ur join au_presupuesto r on ur.au_presupuesto_id=r.id where au_usuario_id= @id;',
    deletePresupuestosUsuarioEmpresa: 'delete from au_usuario_empresa_presupuesto where au_usuario_id= @usuario and au_empresa_id=@empresa;',
    addPresupuestoEmpresa: `insert into au_usuario_empresa_presupuesto (presupuesto,presupuesto_label,proyecto,proyecto_label,centro_c1,centro_c1_label,centro_c2,centro_c2_label,centro_c3,centro_c3_label,centro_c4,centro_c4_label,centro_c5,centro_c5_label,au_usuario_id,au_empresa_id) 
                            values(@presupuesto,@presupuesto_label,@proyecto,@proyecto_label,@centro_c1,@centro_c1_label,@centro_c2,@centro_c2_label,@centro_c3,@centro_c3_label,@centro_c4,@centro_c4_label,@centro_c5,@centro_c5_label,@usuario,@empresa);`,
    getPresupuestoEmpresa: `select * from au_usuario_empresa_presupuesto where au_usuario_id= @usuario and au_empresa_id=@empresa;`,
    getUserById: 'select u.*,s.nombre nombre_supervisor from au_usuario u left join au_usuario s on u.supervisor=s.id where u.id=@id',
    deleteProductById: 'delete from au_usuario where id=@id',
    updateUserById: 'update au_usuario set nombre=@nombre, email=@email, password=@password, supervisor=@sup where id=@id',
    updateUserNoPassById: 'update au_usuario set nombre=@nombre, email=@email, supervisor=@sup where id=@id',
    login: `select
                u.id,
                u.nombre,
                u.password,
                ar.nombre rol
            from
                au_usuario u
            join au_usuario_rol aur  on u.id = aur.au_usuario_id 
            join au_rol ar on aur.au_rol_id = ar.id  where email=@email`,
    deleteEmpresasUsuario: 'delete from au_usuario_empresa where au_usuario_id= @id;',
    addEmpresa: 'insert into au_usuario_empresa (au_usuario_id,au_empresa_id,codigo_proveedor_sap,nombre_proveedor_sap,codigo_usuario_sap,nombre_usuario_sap) values(@usuario,@empresa,@codigo_proveedor,@nombre_proveedor,@codigo_usuario,@nombre_usuario);',
    getEmpresasUsuario: 'select ue.*,e.nombre nombre_empresa from au_usuario_empresa ue left join au_empresa e on ue.au_empresa_id=e.id where au_usuario_id= @id;'
}

export const variousQueries = {
    getRoles: 'select id value,nombre label from au_rol',
    getProveedores: `select id value,nombre + ' (' + nit + ')' label,nombre,nit from au_proveedor where au_empresa_id=@au_empresa_id`,
    insertProveedor: `insert into au_proveedor(nit,nombre,tipo_proveedor,au_empresa_id) values (@nit,@nombre,@tipo_proveedor,@au_empresa_id); SELECT SCOPE_IDENTITY() AS id;`,
    proveedorExists: `select 1 from au_proveedor where nit=@nit and au_empresa_id=@au_empresa_id;`,
}

export const queriesEmpresas = {
    getAllEmpresas: 'select id value,nombre label, moneda_local,moneda_extranjera,maneja_xml from au_empresa',
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
                                dias_atraso_facturacion_depreciacion=@dias_atraso_facturacion_depreciacion,
                                no_identificacion_fiscal=@no_identificacion_fiscal,
                                dia_efectivo_ajuste=@dia_efectivo_ajuste,
                                remanente_nota_credito=@remanente_nota_credito,
                                maneja_xml=@maneja_xml,
                                ajuste_fin_mes=@ajuste_fin_mes,
                                bd_sap=@bd_sap,
                                label_impuesto=@label_impuesto,
                                sap_db_type_label=@sap_db_type_label,
                                ruta_archivos_bancos=@ruta_archivos_bancos,
                                control_numero_factura=@control_numero_factura,
                                bancos=@bancos
                            where 
                            id=@id`,
    addNewEmpresa: `insert into au_empresa (nombre,servidor_licencias,usuario_sap,contrasena_sap,segundos_espera,ruta_archivos,usuario_sql,sap_db_type,contrasena_sql,servidor_sql,base_sql,moneda_local,moneda_extranjera,dias_atraso_facturacion_ruta,valor_impuesto,dias_atraso_facturacion_gastos,no_identificacion_fiscal,dia_efectivo_ajuste,remanente_nota_credito,maneja_xml,ajuste_fin_mes,control_numero_factura,bd_sap,sap_db_type_label,label_impuesto,bancos,ruta_archivos_bancos) 
                    values(@nombre,@servidor_licencias,@usuario_sap,@contrasena_sap,@segundos_espera,@ruta_archivos,@usuario_sql,@sap_db_type,@contrasena_sql,@servidor_sql,@base_sql,@moneda_local,@moneda_extranjera,@dias_atraso_facturacion_ruta,@valor_impuesto,@dias_atraso_facturacion_gastos,@no_identificacion_fiscal,@dia_efectivo_ajuste,@remanente_nota_credito,@maneja_xml,@ajuste_fin_mes,@control_numero_factura,@bd_sap,@sap_db_type_label,@label_impuesto,@bancos,@ruta_archivos_bancos)`,
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
                    Account = IBAN,
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
    getProveedoresSAP: "select CardCode value,label = CardCode + '-' + CardName from OCRD where CardType='S'",
    getUsuariosSAP: 'select SlpCode value,SlpName label from OSLP',
    getCuentasContables: `SELECT
                            value		=	AcctCode
                            ,   label		=	replicate('———', levels - 1) + 
                                                Case when levels = 1 then
                                                    LEFT(AcctCode,1)
                                                when Postable = 'Y' then
                                                    Segment_0
                                                else
                                                    AcctCode
                                                end + ' - ' + AcctName
                            ,  Postable
                        FROM
                            OACT
                        ORDER BY
                            GroupMask,
                            GrpLine`,
    getImpuestos: `select
                        Code + ' - ' + Name + ' (' + CAST ( CAST( Rate AS DECIMAL(16,2)) as varchar ) + ')' label,
                        Rate value
                    from
                        OSTA`,
    getCentrosCosto: `select
                                OcrCode value,
                                OcrName label
                            from
                                OOCR
                            where
                                DimCode = @id`,
    getProyectos: `select
                                PrjCode value,
                                PrjName label
                            from
                                OPRJ`,
    getDocNum: `select DocNum
                from ORPC
                where DocEntry = @id`,
    getDocNumCompras: `select DocNum
                from OPCH
                where DocEntry = @id`,
    getDocNumInv: `select DocNum
                from OPCH
                where DocEntry = @id`,
}
export const queriesGastos = {
    getAllGastos: `select 
                        id value,
                        descripcion label, 
                        ignorar_xml, 
                        depreciacion,
                        control_combustible,
                        control_kilometraje,
                        empresa_codigo,
                        empresa_nombre
                    from 
                        au_gasto`,
    getGastosGrupo: `select 
                            id value,
                            nombre label 
                        from 
                            au_gasto_grupo`,
    getGastosById: 'select * from au_gasto where id=@id',
    getSubGastos: 'select * from au_sub_gasto where au_gasto_id=@id',
    getSubGastosDrop: 'select id value,descripcion label,* from au_sub_gasto where au_gasto_id=@id',
    deleteGastoById: 'delete from au_gasto where id=@id',
    updateGastoById: `update au_gasto 
                        set descripcion=@descripcion, 
                        au_gasto_grupo_id=@au_gasto_grupo_id,
                        au_gasto_grupo_nombre=@au_gasto_grupo_nombre,
                        depreciacion=@depreciacion,
                        control_combustible=@control_combustible,
                        control_kilometraje=@control_kilometraje,
                        lleva_subgastos=@lleva_subgastos,
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
                        empresa_nombre=@empresa_nombre,
                        ignorar_xml=@ignorar_xml
                        where id=@id`,
    deleteGastosUsuario: 'delete from au_sub_gasto where au_gasto_id= @id;',
    addSubGasto: 'insert into au_sub_gasto (descripcion,au_gasto_id,exento,tipo,valor) values(@descripcion,@au_gasto_id,@exento,@tipo,@valor);',
    addNewGasto: `insert into au_gasto (empresa_codigo,empresa_nombre,descripcion,au_gasto_grupo_id,au_gasto_grupo_nombre,depreciacion,control_combustible,control_kilometraje,lleva_subgastos,exento_codigo,exento_nombre,afecto_codigo,afecto_nombre,remanente_codigo,remanente_nombre,exento_impuesto_codigo,exento_impuesto_nombre,afecto_impuesto_codigo,afecto_impuesto_nombre,remanente_impuesto_codigo,remanente_impuesto_nombre,ignorar_xml) 
                    values(@empresa_codigo,@empresa_nombre,@descripcion,@au_gasto_grupo_id,@au_gasto_grupo_nombre,@depreciacion,@control_combustible,@control_kilometraje,@lleva_subgastos,@exento_codigo,@exento_nombre,@afecto_codigo,@afecto_nombre,@remanente_codigo,@remanente_nombre,@exento_impuesto_codigo,@exento_impuesto_nombre,@afecto_impuesto_codigo,@afecto_impuesto_nombre,@remanente_impuesto_codigo,@remanente_impuesto_nombre,@ignorar_xml);
                    SELECT SCOPE_IDENTITY() AS id;`,
}

export const presupuestoQueries = {
    getPresupuesto: `select 
                            id value,
                            nombre label,
                            activo,
                            empresa_codigo empresa, 
                            empresa_nombre,
                            monto_maximo_factura,
                            tipo_gasto_nombre 
                        from 
                            au_presupuesto`,
    getPresupuestoUsuario: `select 
                                p.id value,
                                nombre + ' (' + empresa_nombre + ')' label,
                                activo,
                                empresa_codigo empresa, 
                                empresa_nombre,
                                monto_maximo_factura,
                                tipo_gasto_nombre 
                            from 
                                au_presupuesto p
                            join au_usuario_empresa aue 
                            on p.empresa_codigo = aue.au_empresa_id
                            where aue.au_usuario_id = @user`,
    getTipoGasto: 'select id value,nombre label from au_tipo_gasto',
    getCategoriaGasto: 'select id value,nombre label from au_categoria_gasto',
    getFrecuenciaGasto: 'select id value,nombre label from au_frecuencia_gasto',
    deletePresupuesto: 'delete from au_presupuesto where id = @id;',
    getPresupuestoById: 'select * from au_presupuesto where id=@id',
    updatePresupuestoById: `update au_presupuesto 
                        set nombre=@nombre,
                        monto_maximo_factura=@monto_maximo_factura,
                        moneda_codigo=@moneda_codigo,
                        moneda_nombre=@moneda_nombre,
                        empresa_codigo=@empresa_codigo,
                        empresa_nombre=@empresa_nombre,
                        tipo_gasto_codigo=@tipo_gasto_codigo,
                        activo=@activo,
                        tipo_gasto_nombre=@tipo_gasto_nombre
                        where id=@id`,
    addNewPresupuesto: `insert into au_presupuesto (nombre,monto_maximo_factura,moneda_codigo,moneda_nombre,empresa_codigo,empresa_nombre,tipo_gasto_codigo,tipo_gasto_nombre,activo) 
                    values(@nombre,@monto_maximo_factura,@moneda_codigo,@moneda_nombre,@empresa_codigo,@empresa_nombre,@tipo_gasto_codigo,@tipo_gasto_nombre,@activo);
                    SELECT SCOPE_IDENTITY() AS id;`,
    deleteDetallePresupuesto: 'delete from au_detalle_presupuesto where au_presupuesto_id = @id;',
    addDetallePresupuesto: ` insert into au_detalle_presupuesto (categoria_gasto_codigo,categoria_gasto_nombre,tipo_asignacion,asignacion_cantidad,asignacion_medida,frecuencia_codigo,frecuencia_nombre,au_presupuesto_id) 
                            values(@categoria_gasto_codigo,@categoria_gasto_nombre,@tipo_asignacion,@asignacion_cantidad,@asignacion_medida,@frecuencia_codigo,@frecuencia_nombre,@au_presupuesto_id);`,
    getGastosByUserLiquidacion: `select * 
                                    from 
                                        au_detalle_presupuesto 
                                    where 
                                        au_presupuesto_id=@id`,
    deletePresupuestoById: 'delete from au_presupuesto where id = @id;',
    getPresupuestosEmpresa: 'select id value,nombre label from au_presupuesto where empresa_codigo= @id;',
    getEmpresaPresupuesto: `select
                                e.*
                            from
                                au_empresa e
                            inner join au_presupuesto p on
                                p.empresa_codigo = e.id
                            where
                                p.id = @id`,
    getDetallePresupuesto: `select
                                *
                            from 
                                au_detalle_presupuesto
                            where
                                au_presupuesto_id=@id`,
}

export const liquidacionesQueries = {
    getLiquidaciones: `select
                            l.id value,
                            convert(varchar,
                                    fecha_inicio,
                                103) label,
                            convert(varchar,
                                    fecha_fin,
                                103) fecha_fin,
                            au_estado_liquidacion_id,
                            e.nombre estado,
                            total_facturado,
                            no_aplica,
                            reembolso,
                            au.nombre usuario,
                            ag.id gasto_id,
                            max(aue.au_empresa_id) empresa_id
                        from
                            au_liquidacion l
                        join au_usuario au 
                        on
                            l.au_usuario_id = au.id
                        left join au_presupuesto ag 
                        on 
                            ag.id = l.au_gasto_id
                        left join au_usuario_empresa aue 
                        on
                            l.au_usuario_id = aue.au_usuario_id
                        join au_estado_liquidacion e
                        on
                            l.au_estado_liquidacion_id = e.id
                            group by
                            l.id,
                            fecha_inicio,
                            fecha_fin,
                            au_estado_liquidacion_id,
                            e.nombre,
                            total_facturado,
                            no_aplica,
                            reembolso,
                            au.nombre,
                            ag.id`,
    addLiquidacion: `insert into au_liquidacion (au_usuario_id,au_gasto_id,au_gasto_label,fecha_inicio,fecha_fin,total_facturado,no_aplica,reembolso,comentario)
                      values (@au_usuario_id,@au_gasto_id,@au_gasto_label,@fecha_inicio,@fecha_fin,@total_facturado,@no_aplica,@reembolso,@comentario);SELECT SCOPE_IDENTITY() AS id;`,
    getLiquidacionById: `select
                            l.*,
                            u.nombre,
                            u.id uid
                        from
                            au_liquidacion l
                        inner join au_usuario u 
                            on
                            l.au_usuario_id = u.id
                        where
                            l.id = @id`,
    updateLiquidacionByIdPrincipal: `update au_liquidacion set 
                                au_usuario_id=@au_usuario_id,
                                au_gasto_id=@au_gasto_id,
                                au_gasto_label=@au_gasto_label,
                                fecha_inicio=@fecha_inicio,
                                fecha_fin=@fecha_fin,
                                total_facturado=@total_facturado,
                                no_aplica=@no_aplica,
                                reembolso=@reembolso,
                                comentario=@comentario
                            where id=@id`,
    deleteFacturas: `delete from au_liquidacion_detalle
                     where au_liquidacion_id=@au_liquidacion_id`,
    deleteFacturaById: `delete from au_liquidacion_detalle
                     where id=@id`,
    addFactura: `INSERT INTO au_liquidacion_detalle
                (gasto_value, gasto_label, sub_gasto_value, sub_gasto_label, proveedor_value, proveedor_label, [date], total, moneda, serie, numero, uuid, forma_pago, metodo_pago, cfdi, km_inicial, km_final, cantidad, factura, [xml], au_liquidacion_id,comentarios,periodicidad,del,al,au_presupuesto_id,au_detalle_presupuesto_id,tipo,presupuesto_monto,reembolso,remanente,exento,afecto,au_usuario_id,reembolso_monto,remanente_monto,razon_rechazo)
                VALUES(@gasto_value,@gasto_label,@sub_gasto_value,@sub_gasto_label,@proveedor_value,@proveedor_label,@date,@total,@moneda,@serie,@numero,@uuid,@forma_pago,@metodo_pago,@cfdi,@km_inicial,@km_final,@cantidad,@factura,@xml,@au_liquidacion_id,@comentarios,@periodicidad,@del,@al,@au_presupuesto_id,@au_detalle_presupuesto_id,@tipo,@presupuesto_monto,@reembolso,@remanente,@exento,@afecto,@au_usuario_id,@reembolso_monto,@remanente_monto,@razon_rechazo);`,
    getFacturas: `select 
                        gasto_value, 
                        gasto_label, 
                        sub_gasto_value, 
                        sub_gasto_label, 
                        proveedor_value, 
                        proveedor_label, 
                        convert(varchar, [date], 105) date,
                        total, 
                        moneda, 
                        serie, 
                        numero, 
                        uuid, 
                        forma_pago, 
                        metodo_pago, 
                        cfdi, 
                        km_inicial, 
                        km_final, 
                        cantidad, 
                        factura, 
                        [xml], 
                        au_liquidacion_id,
                        comentarios,
                        id,
                        periodicidad,
                        convert(varchar, [del], 105) del,
                        convert(varchar, [al], 105) al,
                        au_presupuesto_id,
                        au_detalle_presupuesto_id,
                        tipo,
                        presupuesto_monto,
                        reembolso,
                        remanente,
                        exento,
                        afecto,
                        au_usuario_id,
                        reembolso_monto,
                        remanente_monto,
                        razon_rechazo
                  from au_liquidacion_detalle
                  where au_liquidacion_id=@au_liquidacion_id`,
    getFactura: `select 
                        gasto_value, 
                        gasto_label, 
                        sub_gasto_value, 
                        sub_gasto_label, 
                        proveedor_value, 
                        proveedor_label, 
                        convert(varchar, [date], 105) date,
                        total, 
                        moneda, 
                        serie, 
                        numero, 
                        uuid, 
                        forma_pago, 
                        metodo_pago, 
                        cfdi, 
                        km_inicial, 
                        km_final, 
                        cantidad, 
                        factura, 
                        [xml], 
                        au_liquidacion_id,
                        comentarios,
                        id,
                        periodicidad,
                        [del] del,
                        [al] al,
                        au_presupuesto_id,
                        au_detalle_presupuesto_id,
                        tipo,
                        presupuesto_monto,
                        reembolso,
                        remanente,
                        exento,
                        afecto,
                        au_usuario_id
                  from au_liquidacion_detalle
                  where id=@id`,
    deleteLiquidacionById: 'delete from au_liquidacion where id = @id;',
    liquidacionAprobacionSupervisor: 'update au_liquidacion set au_estado_liquidacion_id = 1 where id = @id;',
    getGastosByUserLiquidacion: `select 
                                    ag.id value,
                                    ag.descripcion label,
                                    ag.control_combustible ,
                                    ag.control_kilometraje ,
                                    ag.depreciacion ,
                                    ag.ignorar_xml,
                                    adp.frecuencia_codigo,
                                    adp.au_presupuesto_id,
                                    adp.id linea,
                                    adp.tipo_asignacion tipo,
                                    adp.asignacion_cantidad presupuesto_monto
                                from
                                    au_gasto ag
                                join au_detalle_presupuesto adp 
                                on
                                    ag.id = adp.categoria_gasto_codigo
                                WHERE 
                                    adp.au_presupuesto_id  = @presupuesto`,
    enviarAprobacionSupervisor: `update au_liquidacion
                        set au_estado_liquidacion_id=1
                        where id=@id;`,
    enviarAprobacionContador: `update au_liquidacion
                        set au_estado_liquidacion_id=3,
                            rechazo_supervisor=''
                        where id=@id;`,
    rechazoSupervisor: `update au_liquidacion
                        set au_estado_liquidacion_id=2,
                            rechazo_supervisor=@razon
                        where id=@id;`,
    rechazoContabilidad: `update au_liquidacion
                        set au_estado_liquidacion_id=4,
                            rechazo_contabilidad=@razon
                        where id=@id;`,
    subirSAP: `update au_liquidacion
                        set au_estado_liquidacion_id=5,
                            rechazo_supervisor='',
                            rechazo_contabilidad=''
                        where id=@id;`,
    obtener_detalle: `select
                            *
                        from 
                            au_liquidacion_detalle
                        where
                            del = @del
                        and 
                            al = @al
                        and
                            au_presupuesto_id = @au_presupuesto_id
                        and
                            au_detalle_presupuesto_id = @au_detalle_presupuesto_id
                        and
                            gasto_value = @gasto_value
                        and
                            sub_gasto_value = @sub_gasto_value
                        and
                            au_usuario_id = @au_usuario_id`,
    updateLiquidacionById: `update au_liquidacion_detalle set 
                                reembolso=@reembolso,
                                remanente=@remanente
                            where 
                                id = @id`,
    getEmpresaConnectionInfo: `select
                                    servidor_sql,
                                    base_sql,
                                    sap_db_type,
                                    usuario_sql,
                                    contrasena_sql,
                                    usuario_sap,
                                    contrasena_sap,
                                    servidor_licencias,
                                    ap.empresa_codigo
                                from
                                    au_liquidacion al
                                inner join au_presupuesto ap  
                                on
                                    al.au_gasto_id = ap.id
                                inner join au_empresa ae 
                                on
                                    ap.empresa_codigo = ae.id
                                where
                                    al.id = @id`,
    getFacturasUploadSAP: `select
                                IdLiquidacion = al.id,
                                IDLiquidacionDetalle = ald.id,
                                DocType = 'dDocument_Service',
                                DocDate =
                                case
                                    when ae.ajuste_fin_mes = 1
                                    and day(ald.[date]) >= COALESCE(ae.dia_efectivo_ajuste ,
                                    0) then 
                                                                                        cast(year(dateadd(month, 1, ald.[date])) as varchar) 
                                                                                        + cast(month(dateadd(month, 1, ald.[date])) as varchar) 
                                                                                        + '01'
                                    else
                                    CONVERT(VARCHAR(8), ald.[date],112)
                                end,
                                DocDueDate = CONVERT(VARCHAR(8), ald.[date],112) ,
                                DocTaxDate = CONVERT(VARCHAR(8), ald.[date],112) ,
                                CardCode = aue.codigo_proveedor_sap ,
                                NumAtCard = COALESCE(ald.serie ,
                                '') + ' - ' + ald.numero ,
                                DocCurrency = RTRIM(ap.moneda_codigo),
                                SalesPersonCode = aue.codigo_usuario_sap,
                                U_FacFecha = CONVERT(VARCHAR(8), ald.[date],112) ,
                                U_FacSerie = coalesce(ald.serie ,
                                '') ,
                                U_FacNum = ald.numero ,
                                U_facNit = ap3.nit ,
                                U_facNom = ap2.nombre,
                                U_Clase_LibroCV = ltrim(rtrim(agg.sap)),
                                U_TIPO_DOCUMENTO = 'FC',
                                businessObject = 'oPurchaseInvoices',
                                Comentario = Coalesce(al.comentario ,
                                ''),
                                ItemDescription = ag.descripcion + ' - ' + ald.serie + ' - ' + ald.numero,
                                ald.total,
                                PriceAfVAT = ald.total,
                                ald.afecto,
                                ald.exento ,
                                ald.remanente,
                                ag.exento_impuesto_codigo,
                                ag.exento_codigo,
                                ag.afecto_codigo ,
                                ag.afecto_impuesto_codigo ,
                                ag.remanente_codigo,
                                ag.remanente_impuesto_codigo ,
                                Proyecto = auep.proyecto,
                                C1 = auep.centro_c1,
                                C2 = auep.centro_c2,
                                C3 = auep.centro_c3,
                                C4 = auep.centro_c4,
                                C5 = auep.centro_c5,
                                ald.xml,
                                ald.factura,
                                ag.exento_impuesto_nombre,
                                ag.afecto_impuesto_nombre,
                                ag.remanente_impuesto_nombre,
                                ald.remanente_monto
                            from
                                au_liquidacion al
                            inner join au_liquidacion_detalle ald 
                                                        on
                                ald.au_liquidacion_id = al.id
                            inner join au_presupuesto ap  
                                                            on
                                al.au_gasto_id = ap.id
                            inner join au_detalle_presupuesto adp 
                                                            on
                                adp.id = ald.au_detalle_presupuesto_id
                            inner join au_gasto ag 
                                                            on
                                ald.gasto_value = ag.id
                            inner join au_empresa ae 
                                                            on
                                ap.empresa_codigo = ae.id
                            inner join au_usuario_empresa aue 
                                                            on
                                aue.au_empresa_id = ae.id
                                and al.au_usuario_id = aue.au_usuario_id
                            inner join au_proveedor ap2 
                                                            on
                                ald.proveedor_value = ap2.id
                            inner join au_gasto_grupo agg 
                                                            on
                                agg.id = ag.au_gasto_grupo_id
                            inner join au_proveedor ap3 
                                                        on
                                ap3.id = ald.proveedor_value
                            inner join au_usuario_empresa_presupuesto auep
                                                        on
                                auep.presupuesto = ald.au_presupuesto_id
                            WHERE
                                al.id = @id
                            order by
                                IDLiquidacionDetalle`,
    cerrarLiquidacion: `update au_liquidacion set au_estado_liquidacion_id = 3, resultados_subida_sap=@resultados,rechazo_contabilidad='' where id = @id;`,
    updateLiquidacionSAP: `update au_liquidacion
                        set DocEntry=@DocEntry,
                        DocNum=@DocNum
                    where
                        id=@id`,
    updateFacturaSAP: `update au_liquidacion_detalle
                        set DocEntry=@DocEntry,
                        DocNum=@DocNum,
                        objectType=8
                    where
                        id=@id`,
    rechazoFacturaByID: `update au_liquidacion_detalle
                        set razon_rechazo=@razon_rechazo
                    where
                        id=@id`,
    cuadrarPresupuesto: `select 
                            adp.categoria_gasto_nombre ,
                            adp.tipo_asignacion ,
                            adp.asignacion_cantidad ,
                            adp.asignacion_medida,
                            adp.frecuencia_nombre,
                            total_real = sum(ald.total),
                            cantidad_real = sum(ald.cantidad)
                        FROM 
                            au_detalle_presupuesto adp
                        left join 
                        (
                        select 
                                total,
                                cantidad,
                                gasto_value
                            from au_liquidacion al 
                            inner join au_liquidacion_detalle ald 
                                on ald.au_liquidacion_id =al.id
                            where al.fecha_inicio = @del
                            and al.fecha_fin = @al
                            and al.au_gasto_id =@presupuesto
                        )
                        ald 
                            on ald.gasto_value  = adp.categoria_gasto_codigo 
                        WHERE 
                            adp.au_presupuesto_id = @presupuesto
                        group by
                            adp.categoria_gasto_nombre ,
                            adp.tipo_asignacion ,
                            adp.asignacion_cantidad ,
                            adp.asignacion_medida,
                            adp.frecuencia_nombre`,
}