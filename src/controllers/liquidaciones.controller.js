import {
    getConnection,
    getConnection2,
    liquidacionesQueries,
    queriesSAP
} from '../database';
import {
    eachWeekOfInterval,
    eachMonthOfInterval,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    format
} from 'date-fns'
import { promises as fs } from 'fs'
import sql from 'mssql';
export const getLiquidaciones = async (req, res) => {
    const { user, type } = req.params;
    try {
        const pool = await getConnection();
        let result = null;
        // Contador
        if (parseInt(type) === 3) {
            result = await pool
                .request()
                .input('user', sql.BigInt, user)
                .query(liquidacionesQueries.getLiquidacionesContador);
        } else {
            // Los otros
            result = await pool
                .request()
                .input('user', sql.BigInt, user)
                .query(liquidacionesQueries.getLiquidaciones);
        }
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const addLiquidacion = async (req, res) => {
    const { au_usuario_id, au_gasto_id, fecha_inicio, fecha_fin, total_facturado, no_aplica, reembolso, comentario, au_gasto_label } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('au_usuario_id', sql.BigInt, au_usuario_id)
            .input('au_gasto_id', sql.BigInt, au_gasto_id)
            .input('au_gasto_label', sql.VarChar, au_gasto_label)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_fin', sql.Date, fecha_fin)
            .input('total_facturado', sql.Numeric(38, 2), total_facturado)
            .input('no_aplica', sql.Numeric(38, 2), no_aplica)
            .input('reembolso', sql.Numeric(38, 2), reembolso)
            .input('comentario', sql.VarChar, comentario)
            .query(liquidacionesQueries.addLiquidacion);
        res.json(result.recordset[0].id);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

const adjustDateToLocalTimeZoneDayString = (date) => {
    if (!date) {
        return undefined;
    }
    const dateCopy = new Date(date);
    dateCopy.setTime(dateCopy.getTime() - dateCopy.getTimezoneOffset() * 60 * 1000);
    return dateCopy.toISOString().split('T')[0];
};

export const getLiquidacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const poolE = await getConnection();
        const result = await poolE
            .request()
            .input('id', sql.BigInt, id)
            .query(liquidacionesQueries.getLiquidacionById);

        let ret = result.recordset[0];

        // getFacturas
        const result2 = await poolE
            .request()
            .input('au_liquidacion_id', sql.BigInt, id)
            .query(liquidacionesQueries.getFacturas);

        let facturas = [];

        let sem = eachWeekOfInterval(
            {
                start: new Date(ret.i2),
                end: new Date(ret.f2)
            },
            {
                weekStartsOn: 1
            }
        );
        let mes = eachMonthOfInterval(
            {
                start: new Date(ret.i2),
                end: new Date(ret.f2)
            }
        );
        let semanas = [];
        for (let i = 0; i < sem.length; i++) {
            let start = startOfWeek(sem[i], { weekStartsOn: 1 });
            let end = endOfWeek(sem[i], { weekStartsOn: 1 });
            semanas.push([start, end]);
        }
        let meses = [];
        for (let i = 0; i < mes.length; i++) {
            let start = startOfMonth(mes[i], { weekStartsOn: 1 });
            let end = endOfMonth(mes[i], { weekStartsOn: 1 });
            meses.push([start, end]);
        }

        for (let i = 0; i < result2.recordset.length; i++) {
            // let fecha = result2.recordset[i].date.replaceAll("-", "/");

            let row = [
                result2.recordset[i].gasto_value,
                result2.recordset[i].gasto_label,
                result2.recordset[i].sub_gasto_value,
                result2.recordset[i].sub_gasto_label,
                result2.recordset[i].proveedor_value,
                result2.recordset[i].proveedor_label,
                result2.recordset[i].date,
                result2.recordset[i].total,
                result2.recordset[i].moneda,
                result2.recordset[i].serie,
                result2.recordset[i].numero,//10
                result2.recordset[i].uuid,
                result2.recordset[i].forma_pago,
                result2.recordset[i].metodo_pago,
                result2.recordset[i].cfdi,
                result2.recordset[i].km_inicial,
                result2.recordset[i].km_final,
                result2.recordset[i].cantidad,
                result2.recordset[i].factura,
                result2.recordset[i].xml,
                result2.recordset[i].au_liquidacion_id,//20
                result2.recordset[i].comentarios,
                result2.recordset[i].id,
                result2.recordset[i].reembolso,
                result2.recordset[i].remanente,
                result2.recordset[i].reembolso_monto,
                result2.recordset[i].remanente_monto,
                result2.recordset[i].razon_rechazo,
                result2.recordset[i].del2,
                result2.recordset[i].al2,
            ];
            facturas.push(row);
        }

        ret.facturas = facturas;

        // Get presupesto vs real
        const result3 = await poolE
            .request()
            .input('id', sql.BigInt, ret.au_gasto_id)
            .query(liquidacionesQueries.getDetallePresupuesto);

        let cuadrar = result3.recordset;

        for (let i = 0; i < cuadrar.length; i++) {
            let fechs = [];
            if (cuadrar[i].frecuencia_nombre.toLowerCase() === "semanal") {
                fechs = [...semanas];
            } else {
                fechs = [...meses];
            }

            let cantidad = 0;
            let total = 0;
            for (let j = 0; j < fechs.length; j++) {
                let ini = adjustDateToLocalTimeZoneDayString(fechs[j][0]);
                let fin = adjustDateToLocalTimeZoneDayString(fechs[j][1]);
                const result4 = await poolE
                    .request()
                    .input('id', sql.BigInt, cuadrar[i].id)
                    .input('del', sql.Date, ini)
                    .input('al', sql.Date, fin)
                    .input('usuario', sql.BigInt, ret.uid)
                    .query(liquidacionesQueries.getEjecutado);
                console.log(cuadrar[i].id, ini, fin, ret.uid);
                total += result4.recordset[0].total === null ? 0 : parseFloat(result4.recordset[0].total);
                cantidad += result4.recordset[0].cantidad === null ? 0 : parseFloat(result4.recordset[0].cantidad);
            }
            cuadrar[i].total_real = total;
            cuadrar[i].cantidad_real = cantidad;
        }

        ret.cuadrar = cuadrar;

        res.json(ret);


    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateLiquidacionById = async (req, res) => {
    const { id } = req.params;
    const {
        au_usuario_id,
        au_gasto_id,
        fecha_inicio,
        fecha_fin,
        total_facturado,
        no_aplica,
        reembolso,
        comentario,
        au_gasto_label
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('au_usuario_id', sql.BigInt, au_usuario_id)
            .input('au_gasto_id', sql.BigInt, au_gasto_id)
            .input('au_gasto_label', sql.VarChar, au_gasto_label)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_fin', sql.Date, fecha_fin)
            .input('total_facturado', sql.Numeric(38, 2), total_facturado)
            .input('no_aplica', sql.Numeric(38, 2), no_aplica)
            .input('reembolso', sql.Numeric(38, 2), reembolso)
            .input('comentario', sql.VarChar, comentario)
            .input('id', id)
            .query(liquidacionesQueries.updateLiquidacionByIdPrincipal);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

    res.json({ msg: "Liquidación actualizada con éxito!" });
};

export const deleteLiquidacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(liquidacionesQueries.deleteLiquidacionById);

        const result2 = await pool
            .request()
            .input('id', sql.Int, id)
            .query(liquidacionesQueries.deleteLiquidacionDetalleById);

        res.json({ msg: "Liquidación eliminada exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const liquidacionAprobacionSupervisor = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(liquidacionesQueries.liquidacionAprobacionSupervisor);

        res.json({ msg: "¡Liquidación enviada a aprobacion exitosamente!" });
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const getGastosByUserLiquidacion = async (req, res) => {
    const {
        user,
        presupuesto
    } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('user', sql.Int, user)
            .input('presupuesto', sql.Int, presupuesto)
            .query(liquidacionesQueries.getGastosByUserLiquidacion);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};
export const enviarAprobacionSupervisor = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(liquidacionesQueries.enviarAprobacionSupervisor);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};
export const enviarAprobacionContador = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(liquidacionesQueries.enviarAprobacionContador);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};
export const rechazoSupervisor = async (req, res) => {
    const {
        id,
        razon
    } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('razon', sql.Text, razon)
            .query(liquidacionesQueries.rechazoSupervisor);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};
export const rechazoContabilidad = async (req, res) => {
    const {
        id,
        razon
    } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('razon', sql.Text, razon)
            .query(liquidacionesQueries.rechazoContabilidad);
        res.json(result.recordset);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};
export const subirSAP = async (req, res) => {
    var axios = require('axios');
    const {
        id
    } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(liquidacionesQueries.getEmpresaConnectionInfo);
        let e = result.recordset[0];

        var data = `<?xml version="1.0" encoding="utf-8"?>
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <Login xmlns="http://tempuri.org/wsSalesQuotation/Service1">
              <DataBaseServer>${e.servidor_sql}</DataBaseServer>
              <DataBaseName>${e.base_sql}</DataBaseName>
              <DataBaseType>${e.sap_db_type}</DataBaseType>
              <DataBaseUserName>${e.usuario_sql}</DataBaseUserName>
              <DataBasePassword>${e.contrasena_sql}</DataBasePassword>
              <CompanyUserName>${e.usuario_sap}</CompanyUserName>
              <CompanyPassword>${e.contrasena_sap}</CompanyPassword>
              <Language>ln_English</Language>
              <LicenseServer>${e.servidor_licencias}:30000</LicenseServer>
            </Login>
          </soap12:Body>
        </soap12:Envelope>`;

        var config = {
            method: 'post',
            url: `http://${e.servidor_licencias}/wsSalesQuotation/DiServerServices.asmx?WSDL`,
            headers: {
                'Content-Type': 'application/soap+xml'
            },
            data: data
        };

        const response = await axios(config);

        let xmlParser = require('xml2json');
        let r = JSON.parse(xmlParser.toJson(response.data));
        r = r["soap:Envelope"]["soap:Body"]["LoginResponse"]["LoginResult"];

        const result2 = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(liquidacionesQueries.getFacturasUploadSAP);

        let log = '';
        let credito = 0;
        let header = ``;
        let err = 0;
        for (let i = 0; i < result2.recordset.length; i++) {
            let l = result2.recordset[i];

            /******************************************************************************************************************************
             * Subimos los Attachments
             *******************************************************************************************************************************/
            // Timestamp to avoid name duplicates
            let ts = Date.now();
            let path_upload_ = "\\\\SAPSERVER02\\AttachmentsSAP";
            let path_ = 'C:\\AttachmentsSAP';
            // let path_upload_ = "c:\\";
            // let path_ = 'C:\\';
            let xmlRow = '';
            if (l.xml !== '') {
                await fs.writeFile(path_upload_ + "\\" + l.IDLiquidacionDetalle + '-' + ts + '.xml', l.xml, { encoding: 'utf8' });
                xmlRow = `<row>
                            <SourcePath>${path_}</SourcePath>
                            <FileName>${l.IDLiquidacionDetalle}-${ts}</FileName>
                            <FileExtension>xml</FileExtension>
                        </row>`;
            }

            let mimeType = l.factura.match(/[^:/]\w+(?=;|,)/)[0];

            let factura = l.factura.split("base64,")[1];
            await fs.writeFile(path_upload_ + "\\" + l.IDLiquidacionDetalle + '-' + ts + '.' + mimeType, factura, { encoding: 'base64' });


            // let exist = await fs.stat(path + l.IDLiquidacionDetalle + '2.xml');
            // console.log(exist);
            let upload = `<?xml version="1.0" encoding="utf-8"?>
                            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                                <soap12:Body>
                                    <AddPurchaseOrder xmlns="http://tempuri.org/wsSalesQuotation/Service1">
                                        <SessionID>${r}</SessionID>
                                        <sXmlOrderObject>
                                <![CDATA[<BOM>
                                <BO>
                                    <AdmInfo>
                                        <Object>oAttachments2</Object>
                                    </AdmInfo>
                                    <Attachments2 />
                                    <Attachments2_Lines>${xmlRow}
                                        <row>
                                            <SourcePath>${path_}</SourcePath>
                                            <FileName>${l.IDLiquidacionDetalle}-${ts}</FileName>
                                            <FileExtension>${mimeType}</FileExtension>
                                        </row>
                                    </Attachments2_Lines>
                                </BO>
                            </BOM>]]>
                            </sXmlOrderObject>
                            </AddPurchaseOrder>
                            </soap12:Body>
                            </soap12:Envelope>`;
            config = {
                method: 'post',
                url: `http://${e.servidor_licencias}/wsSalesQuotation/DiServerServices.asmx?WSDL`,
                headers: {
                    'Content-Type': 'application/soap+xml'
                },
                data: upload
            };

            let responseA = await axios(config);
            let rA = JSON.parse(xmlParser.toJson(responseA.data));
            let attachment = 0;
            if (typeof rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse'] !== "undefined") {
                // log += `<strong>Attachment</strong>: ${rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']}<br>`;
                // console.log(rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']);
                attachment = rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey'];
            } else {
                // log += `<strong>Attachment Error</strong>: ${rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']}<br>`;
                // console.log(rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']);
                err = 1;
            }
            /******************************************************************************************************************************
             * Subimos los Attachments
             *******************************************************************************************************************************/
            /******************************************************************************************************************************
             * Subimos la factura
             *******************************************************************************************************************************/
            header = `<Documents>
                            <row>
                                <DocType>${l.DocType}</DocType>
                                <DocDate>${l.DocDate}</DocDate>
                                <DocDueDate>${l.DocDueDate}</DocDueDate>
                                <TaxDate>${l.DocTaxDate}</TaxDate>
                                <CardCode>${l.CardCode}</CardCode>
                                <NumAtCard>${l.NumAtCard}</NumAtCard>
                                <DocCurrency>${l.DocCurrency}</DocCurrency>
                                <SalesPersonCode>${l.SalesPersonCode}</SalesPersonCode>
                                <U_FacFecha>${l.U_FacFecha}</U_FacFecha>
                                <U_FacSerie>${l.U_FacSerie}</U_FacSerie>
                                <U_FacNo>${l.U_FacNum}</U_FacNo>
                                <U_FacNum>10</U_FacNum>
                                <U_FacNit>${l.U_facNit.trim()}</U_FacNit>
                                <U_FacNom>${l.U_facNom}</U_FacNom>
                                <U_Clase_LibroCV>${l.U_Clase_LibroCV}</U_Clase_LibroCV>
                                <U_TIPO_DOCUMENTO>${l.U_TIPO_DOCUMENTO}</U_TIPO_DOCUMENTO>
                                <Comments>${l.Comentario}</Comments>`;
            //Si si se subió el attachment
            if (attachment > 0) {
                header += `<AttachmentEntry>${attachment}</AttachmentEntry>`;
            }
            header += `</row>
                        </Documents>`;

            let body = `<row>
                            <ItemDescription>
                                ${l.ItemDescription}
                            </ItemDescription>
                            <PriceAfterVAT>
                                ${l.afecto}
                            </PriceAfterVAT>
                            <AccountCode>
                                ${l.afecto_codigo}
                            </AccountCode>
                            <TaxCode>
                                ${l.afecto_impuesto_nombre.split('-')[0].trim()}
                            </TaxCode>
                            <ProjectCode>
                                ${l.Proyecto}
                            </ProjectCode>
                            <CostingCode>
                                ${l.C1}
                            </CostingCode>
                            <CostingCode2>
                                ${l.C2}
                            </CostingCode2>
                            <CostingCode3>
                                ${l.C3}
                            </CostingCode3>
                            <CostingCode4>
                                ${l.C4}
                            </CostingCode4>
                            <CostingCode5>
                                ${l.C5 > 0 ? l.C5 : ""}
                            </CostingCode5>
                        </row>`;
            if (parseFloat(l.exento) > 0) {
                body += `<row>
                            <ItemDescription>
                                ${l.ItemDescription}
                            </ItemDescription>
                            <PriceAfterVAT>
                                ${l.exento}
                            </PriceAfterVAT>
                            <AccountCode>
                                ${l.exento_codigo}
                            </AccountCode>
                            <TaxCode>
                                ${l.exento_impuesto_nombre.split('-')[0].trim()}
                            </TaxCode>
                            <ProjectCode>
                                ${l.Proyecto}
                            </ProjectCode>
                            <CostingCode>
                                ${l.C1}
                            </CostingCode>
                            <CostingCode2>
                                ${l.C2}
                            </CostingCode2>
                            <CostingCode3>
                                ${l.C3}
                            </CostingCode3>
                            <CostingCode4>
                                ${l.C4}
                            </CostingCode4>
                            <CostingCode5>
                                ${l.C5 > 0 ? l.C5 : ""}
                            </CostingCode5>
                        </row>`;
            }

            let envelope = `<?xml version="1.0" encoding="utf-8"?>
                            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                                <soap12:Body>
                                    <AddPurchaseOrder xmlns="http://tempuri.org/wsSalesQuotation/Service1">
                                        <SessionID>${r}</SessionID>
                                        <sXmlOrderObject>
                                            <![CDATA[<BOM xmlns='http://www.sap.com/SBO/DIS'>
                                                <BO>
                                                    <AdmInfo>
                                                        <Object>oPurchaseInvoices</Object>
                                                    </AdmInfo>
                                                    ${header}
                                                    <Document_Lines>
                                                        ${body}
                                                    </Document_Lines>
                                                </BO>
                                            </BOM>]]>
                                        </sXmlOrderObject>
                                    </AddPurchaseOrder>
                                </soap12:Body>
                            </soap12:Envelope>`;
            config = {
                method: 'post',
                url: `http://${e.servidor_licencias}/wsSalesQuotation/DiServerServices.asmx?WSDL`,
                headers: {
                    'Content-Type': 'application/soap+xml'
                },
                data: envelope
            };
            let response2 = await axios(config);

            let r2 = JSON.parse(xmlParser.toJson(response2.data));
            if (typeof r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse'] !== "undefined") {

                const poolS = await getConnection2(e.empresa_codigo);
                const result2 = await poolS
                    .request()
                    .input('id', sql.Int, r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey'])
                    .query(queriesSAP.getDocNumInv);

                log += `<strong>Factura</strong>: ${r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']} DocNum: ${result2.recordset[0].DocNum}<br>`;
                console.log(`<strong>Factura</strong>: ${r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']} DocNum: ${result2.recordset[0].DocNum}<br>`);

                updateFacturaSAP(l.IDLiquidacionDetalle, r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey'], result2.recordset[0].DocNum);
            } else {
                log += `<strong>Factura Error</strong>: ${r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']}<br>`;
                console.log(r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']);
                err = 1;
            }
            /******************************************************************************************************************************
             * Eliminamos el attachment
             *******************************************************************************************************************************/
            if (l.xml !== '') {
                fs.unlink(path_upload_ + "\\" + l.IDLiquidacionDetalle + '-' + ts + '.xml');
            }
            fs.unlink(path_upload_ + "\\" + l.IDLiquidacionDetalle + '-' + ts + '.' + mimeType);
            if ((l.PriceAfVAT - l.exento) > 0) {
                credito += l.remanente_monto;
            }
        }
        /******************************************************************************************************************************
         * Subimos la nota de credito
         *******************************************************************************************************************************/
        let l = result2.recordset[result2.recordset.length - 1];
        if (credito > 0) {
            header = `<Documents>
                            <row>
                                <DocType>${l.DocType}</DocType>
                                <DocDate>${l.DocDate}</DocDate>
                                <DocDueDate>${l.DocDueDate}</DocDueDate>
                                <TaxDate>${l.DocTaxDate}</TaxDate>
                                <CardCode>${l.CardCode}</CardCode>
                                <NumAtCard>${l.NumAtCard}</NumAtCard>
                                <DocCurrency>${l.DocCurrency}</DocCurrency>
                                <SalesPersonCode>${l.SalesPersonCode}</SalesPersonCode>
                                <U_FacFecha>${l.U_FacFecha}</U_FacFecha>
                                <U_FacSerie>${l.U_FacSerie}</U_FacSerie>
                                <U_FacNo>${l.U_FacNum}</U_FacNo>
                                <U_FacNum>10</U_FacNum>
                                <U_FacNit>0000000000</U_FacNit>
                                <U_FacNom>${l.SalesPersonName}</U_FacNom>
                                <U_Clase_LibroCV>${l.U_Clase_LibroCV}</U_Clase_LibroCV>
                                <U_TIPO_DOCUMENTO>${l.U_TIPO_DOCUMENTO}</U_TIPO_DOCUMENTO>
                                <U_STATUS_NC>A</U_STATUS_NC>
                                <Comments>${l.Comentario}</Comments>
                            </row>
                        </Documents>`;
            let body = `<row>
                    <ItemDescription>
                        ${l.ItemDescription}
                    </ItemDescription>
                    <PriceAfterVAT>
                        ${credito}
                    </PriceAfterVAT>
                    <AccountCode>
                        ${l.afecto_codigo}
                    </AccountCode>
                    <TaxCode>
                        ${l.remanente_impuesto_nombre.split('-')[0].trim()}
                    </TaxCode>
                    <ProjectCode>
                        ${l.Proyecto}
                    </ProjectCode>
                    <CostingCode>
                        ${l.C1}
                    </CostingCode>
                    <CostingCode2>
                        ${l.C2}
                    </CostingCode2>
                    <CostingCode3>
                        ${l.C3}
                    </CostingCode3>
                    <CostingCode4>
                        ${l.C4}
                    </CostingCode4>
                    <CostingCode5>
                        ${l.C5 > 0 ? l.C5 : ""}
                    </CostingCode5>
                </row>`;
            let envelope = `<?xml version="1.0" encoding="utf-8"?>
                        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                            <soap12:Body>
                                <AddPurchaseOrder xmlns="http://tempuri.org/wsSalesQuotation/Service1">
                                    <SessionID>${r}</SessionID>
                                    <sXmlOrderObject>
                                        <![CDATA[<BOM xmlns='http://www.sap.com/SBO/DIS'>
                                            <BO>
                                                <AdmInfo>
                                                    <Object>oPurchaseCreditNotes</Object>
                                                </AdmInfo>
                                                ${header}
                                                <Document_Lines>
                                                    ${body}
                                                </Document_Lines>
                                            </BO>
                                        </BOM>]]>
                                    </sXmlOrderObject>
                                </AddPurchaseOrder>
                            </soap12:Body>
                        </soap12:Envelope>`;
            // console.log(envelope);
            config = {
                method: 'post',
                url: `http://${e.servidor_licencias}/wsSalesQuotation/DiServerServices.asmx?WSDL`,
                headers: {
                    'Content-Type': 'application/soap+xml'
                },
                data: envelope
            };

            let response3 = await axios(config);

            let r3 = JSON.parse(xmlParser.toJson(response3.data));
            if (typeof r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse'] !== "undefined") {
                // console.log(r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']);

                const poolS = await getConnection2(e.empresa_codigo);
                const result2 = await poolS
                    .request()
                    .input('id', sql.Int, r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey'])
                    .query(queriesSAP.getDocNum);
                log += `<strong>Nota de Crédito</strong>: ${r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']} DocNum: ${result2.recordset[0].DocNum}<br><br>`;

                updateLiquidacionSAP(l.IdLiquidacion, r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey'], result2.recordset[0].DocNum);
            } else {
                log += `<strong>Nota de Crédito Error</strong>: ${r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']}<br><br>`;
                console.log(r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']);
                err = 1;
            }
        }
        /******************************************************************************************************************************
         * Subimos la nota de crédito
         *******************************************************************************************************************************/
        //  cerrarLiquidacion
        if (err === 0) {
            await pool
                .request()
                .input('id', sql.Int, id)
                .input('resultados', sql.Text, log)
                .query(liquidacionesQueries.cerrarLiquidacion);
            res.json(true);
        } else {
            await pool
                .request()
                .input('id', sql.Int, id)
                .input('resultados', sql.Text, log)
                .query(liquidacionesQueries.cerrarLiquidacion);
            res.json(false);
        }
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send(err.message);
    }
};
export const calculoFactura = async (req, res) => {
    const {
        id,
        liquidacion_id
    } = req.params;

    let v = req.body;

    let tipo = v[26];
    let cantidad_presupuestada = v[27];
    let total = parseFloat(v[7]);
    if (tipo === "unidad") {
        total = parseFloat(v[17]);
    }
    let reembolso = 0;
    let remanente = 0;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('del', sql.Date, v[22])
            .input('al', sql.Date, v[23])
            .input('au_presupuesto_id', sql.BigInt, v[24])
            .input('au_detalle_presupuesto_id', sql.BigInt, v[25])
            .input('au_usuario_id', sql.BigInt, v[31])
            .input('gasto_value', sql.BigInt, v[0])
            .query(liquidacionesQueries.obtener_detalle);

        let suma_cantidad = 0;
        for (let i = 0; i < result.recordset.length; i++) {
            if (tipo === "dinero") {
                suma_cantidad += parseFloat(result.recordset[i].total);
            } else {
                suma_cantidad += parseFloat(result.recordset[i].cantidad);
            }
        }

        // Obtenemos el sobrante de la factura que estamos ingresando
        let sobrante = cantidad_presupuestada - suma_cantidad;
        // sobrante = sobrante < 0 ? 0 : sobrante;
        if (sobrante >= total) {
            reembolso = total;
            remanente = 0;
        } else {
            if (sobrante < 0) {
                reembolso = 0;
                remanente = total;
            } else {
                reembolso = sobrante;
                remanente = parseFloat(total) - parseFloat(sobrante);
            }
        }


        let reembolso_monto = reembolso;
        let remanente_monto = remanente;

        // let precio_por_unidad = parseFloat(v[7]) / parseFloat(v[17]);
        // v[17] = Cantidad
        // if (parseFloat(v[17]) > 0) {
        //     reembolso_monto = precio_por_unidad * parseFloat(reembolso);
        //     remanente_monto = precio_por_unidad * parseFloat(remanente);
        // }


        // Insertamos la factura
        await pool
            .request()
            .input('gasto_value', sql.BigInt, v[0])
            .input('gasto_label', sql.VarChar, v[1])
            .input('sub_gasto_value', sql.BigInt, v[2])
            .input('sub_gasto_label', sql.VarChar, v[3])
            .input('proveedor_value', sql.BigInt, v[4])
            .input('proveedor_label', sql.VarChar, v[5])
            .input('date', sql.Date, v[6])
            .input('total', sql.Numeric(38, 2), v[7])
            .input('moneda', sql.VarChar, v[8])
            .input('serie', sql.VarChar, v[9])
            .input('numero', sql.VarChar, v[10])
            .input('uuid', sql.VarChar, v[11])
            .input('forma_pago', sql.VarChar, v[12])
            .input('metodo_pago', sql.VarChar, v[13])
            .input('cfdi', sql.VarChar, v[14])
            .input('km_inicial', sql.VarChar, v[15])
            .input('km_final', sql.VarChar, v[16])
            .input('cantidad', sql.VarChar, v[17])
            .input('factura', sql.VarChar, v[18])
            .input('xml', sql.VarChar, v[19])
            .input('comentarios', sql.Text, v[20])
            .input('au_liquidacion_id', sql.BigInt, liquidacion_id)
            .input('periodicidad', sql.Int, v[21])
            .input('del', sql.Date, v[22])
            .input('al', sql.Date, v[23])
            .input('au_presupuesto_id', sql.BigInt, v[24])
            .input('au_detalle_presupuesto_id', sql.BigInt, v[25])
            .input('tipo', sql.VarChar, v[26])
            .input('presupuesto_monto', sql.Numeric(38, 2), v[27])
            .input('reembolso', sql.Numeric(38, 2), reembolso)
            .input('remanente', sql.Numeric(38, 2), remanente)
            .input('exento', sql.Numeric(38, 2), v[29])
            .input('afecto', sql.Numeric(38, 2), v[30])
            .input('reembolso_monto', sql.Numeric(38, 2), reembolso_monto)
            .input('remanente_monto', sql.Numeric(38, 2), remanente_monto)
            .input('razon_rechazo', sql.Text, v[32])
            .input('au_usuario_id', sql.BigInt, v[31])
            .query(liquidacionesQueries.addFactura);

        await deleteFactura(
            id,
            v[22],
            v[23],
            v[24],
            v[25],
            v[31],
            cantidad_presupuestada,
            tipo,
            v[0],
            v[2]
        );

        res.json(true);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};
const deleteFactura = async (
    id,
    del,
    al,
    au_presupuesto_id,
    au_detalle_presupuesto_id,
    au_usuario_id,
    presupuesto_monto,
    tipo,
    gasto_value,
    sub_gasto_value
) => {
    const pool = await getConnection();

    // Delete Factura
    await pool
        .request()
        .input('id', sql.Int, id)
        .query(liquidacionesQueries.deleteFacturaById);
    updateRemanente(
        del,
        al,
        au_presupuesto_id,
        au_detalle_presupuesto_id,
        au_usuario_id,
        presupuesto_monto,
        tipo,
        gasto_value,
        sub_gasto_value
    );

};
const updateRemanente = async (
    del,
    al,
    au_presupuesto_id,
    au_detalle_presupuesto_id,
    au_usuario_id,
    presupuesto_monto,
    tipo,
    gasto_value,
    sub_gasto_value
) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input('del', sql.Date, new Date(del))
        .input('al', sql.Date, new Date(al))
        .input('au_presupuesto_id', sql.BigInt, au_presupuesto_id)
        .input('au_detalle_presupuesto_id', sql.BigInt, au_detalle_presupuesto_id)
        .input('au_usuario_id', sql.BigInt, au_usuario_id)
        .input('gasto_value', sql.BigInt, gasto_value)
        .input('sub_gasto_value', sql.BigInt, sub_gasto_value)
        .query(liquidacionesQueries.obtener_detalle);

    let suma_cantidad = presupuesto_monto;
    for (let i = 0; i < result.recordset.length; i++) {
        let id = result.recordset[i].id;
        let tot = 0;
        if (tipo === "dinero") {
            suma_cantidad -= parseFloat(result.recordset[i].total);
            tot = result.recordset[i].total;
        } else {
            suma_cantidad -= parseFloat(result.recordset[i].cantidad);
            tot = result.recordset[i].cantidad;
        }

        let reembolso, remanente;
        if (suma_cantidad >= 0) {
            reembolso = tot;
            remanente = 0;
        } else {
            reembolso = tot + suma_cantidad;
            remanente = -suma_cantidad;
        }

        // Update factura valores
        await pool
            .request()
            .input('reembolso', sql.Numeric(38, 2), reembolso)
            .input('remanente', sql.Numeric(38, 2), remanente)
            .input('id', id)
            .query(liquidacionesQueries.updateFacturasById);
    }
}
export const deleteFacturaByID = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const pool = await getConnection();

        // Get info de la factura
        const result = await pool
            .request()
            .input('id', sql.BigInt, id)
            .query(liquidacionesQueries.getFactura);

        await deleteFactura(
            id,
            result.recordset[0].del,
            result.recordset[0].al,
            result.recordset[0].au_presupuesto_id,
            result.recordset[0].au_detalle_presupuesto_id,
            result.recordset[0].au_usuario_id,
            result.recordset[0].presupuesto_monto,
            result.recordset[0].tipo,
            result.recordset[0].gasto_value,
            result.recordset[0].sub_gasto_value
        )
        res.json(true);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
};

export const updateLiquidacionSAP = async (id, DocEntry, DocNum) => {

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('DocEntry', sql.BigInt, DocEntry)
            .input('DocNum', sql.BigInt, DocNum)
            .input('id', id)
            .query(liquidacionesQueries.updateLiquidacionSAP);

    } catch (err) {
        // res.status(500);
        console.log(err.message);
    }

    // res.json({ msg: "Liquidación actualizada con éxito!" });
};

export const updateFacturaSAP = async (id, DocEntry, DocNum) => {
    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('DocEntry', sql.BigInt, DocEntry)
            .input('DocNum', sql.BigInt, DocNum)
            .input('id', id)
            .query(liquidacionesQueries.updateFacturaSAP);

    } catch (err) {
        console.log(err.message);
    }

    // res.json({ msg: "Liquidación actualizada con éxito!" });
};

export const rechazoFacturaByID = async (req, res) => {

    const { id } = req.params;
    const {
        razon
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('razon_rechazo', sql.Text, razon)
            .input('id', id)
            .query(liquidacionesQueries.rechazoFacturaByID);

    } catch (err) {
        console.log(err.message);
        res.json({ msg: err.message });
    }

    res.json({ msg: "¡Factura rechazada!" });
};