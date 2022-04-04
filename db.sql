ALTER TABLE liquidaciones.dbo.au_gasto_grupo ADD sap varchar(100) NULL;

CREATE TABLE liquidaciones.dbo.au_liquidacion_detalle (
	id bigint IDENTITY(0,1) NOT NULL,
	gasto_value bigint NULL,
	gasto_label varchar(255) NULL,
	sub_gasto_value bigint NULL,
	sub_gasto_label varchar(255) NULL,
	proveedor_value bigint NULL,
	proveedor_label varchar(255) NULL,
	[date] date NULL,
	total numeric(38,0) NULL,
	moneda varchar(100) NULL,
	serie varchar(100) NULL,
	numero varchar(255) NULL,
	uuid varchar(255) NULL,
	forma_pago varchar(100) NULL,
	metodo_pago varchar(100) NULL,
	cfdi varchar(100) NULL,
	km_inicial varchar(100) NULL,
	km_final varchar(100) NULL,
	cantidad varchar(100) NULL,
	factura text NULL,
	[xml] text NULL,
	au_liquidacion_id bigint NULL,
	comentarios text NULL,
	CONSTRAINT au_liquidacion_detalle_PK PRIMARY KEY (id)
);
ALTER TABLE liquidaciones.dbo.au_liquidacion ADD au_estado_liquidacion_id bigint NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion ADD  DEFAULT 0 FOR au_estado_liquidacion_id;

ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD periodicidad varchar(100) NULL;
EXEC liquidaciones.sys.sp_addextendedproperty 'MS_Description', N'cantidad/monto', 'schema', N'dbo', 'table', N'au_liquidacion_detalle';
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD del date NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD al date NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD au_presupuesto_id bigint NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD au_detalle_presupuesto_id bigint NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD tipo varchar(100) NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD presupuesto_monto numeric(38,0) NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD reembolso numeric(38,0) NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD remanente numeric(38,0) NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD exento numeric(38,0) NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD afecto bigint NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ALTER COLUMN periodicidad int NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ADD au_usuario_id bigint NULL;


EXEC liquidaciones.sys.sp_updateextendedproperty 'MS_Description', N'Presupuesto.', 'schema', N'dbo', 'table', N'au_liquidacion_detalle', 'column', N'au_presupuesto_id';

ALTER TABLE liquidaciones.dbo.au_gasto_grupo ADD sap varchar(100) NULL;
ALTER TABLE liquidaciones.dbo.au_gasto_grupo ADD CONSTRAINT au_gasto_grupo_PK PRIMARY KEY (id);
ALTER TABLE liquidaciones.dbo.au_liquidacion_detalle ALTER COLUMN cantidad numeric(38,0) NULL;
ALTER TABLE liquidaciones.dbo.au_liquidacion ADD resultados_subida_sap text NULL;
