import { getConnection, liquidacionesQueries } from '../database';
import { promises as fs } from 'fs'
import sql from 'mssql';
export const getLiquidaciones = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query(liquidacionesQueries.getLiquidaciones);
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
            .input('total_facturado', sql.Numeric, total_facturado)
            .input('no_aplica', sql.Numeric, no_aplica)
            .input('reembolso', sql.Numeric, reembolso)
            .input('comentario', sql.VarChar, comentario)
            .query(liquidacionesQueries.addLiquidacion);
        res.json(result.recordset[0].id);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
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
                result2.recordset[i].numero,
                result2.recordset[i].uuid,
                result2.recordset[i].forma_pago,
                result2.recordset[i].metodo_pago,
                result2.recordset[i].cfdi,
                result2.recordset[i].km_inicial,
                result2.recordset[i].km_final,
                result2.recordset[i].cantidad,
                result2.recordset[i].factura,
                result2.recordset[i].xml,
                result2.recordset[i].au_liquidacion_id,
                result2.recordset[i].comentarios,
                result2.recordset[i].id,
                result2.recordset[i].reembolso,
                result2.recordset[i].remanente,
            ];
            facturas.push(row);
        }

        ret.facturas = facturas;
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
            .input('total_facturado', sql.Numeric, total_facturado)
            .input('no_aplica', sql.Numeric, no_aplica)
            .input('reembolso', sql.Numeric, reembolso)
            .input('comentario', sql.VarChar, comentario)
            .input('id', id)
            .query(liquidacionesQueries.updateLiquidacionByIdPrincipal);

        // await pool
        //     .request()
        //     .input('au_liquidacion_id', sql.Int, id)
        //     .query(liquidacionesQueries.deleteFacturas);

        // if (facturas.length > 0) {
        //     for (let i = 0; i < facturas.length; i++) {
        //         let fecha = facturas[i][6].split("/");
        //         fecha = fecha[2] + '=' + fecha[1] + '-' + fecha[0];
        //         await pool
        //             .request()
        //             .input('gasto_value', sql.BigInt, facturas[i][0])
        //             .input('gasto_label', sql.VarChar, facturas[i][1])
        //             .input('sub_gasto_value', sql.BigInt, facturas[i][2])
        //             .input('sub_gasto_label', sql.VarChar, facturas[i][3])
        //             .input('proveedor_value', sql.BigInt, facturas[i][4])
        //             .input('proveedor_label', sql.VarChar, facturas[i][5])
        //             .input('date', sql.Date, fecha)
        //             .input('total', sql.Numeric, facturas[i][7])
        //             .input('moneda', sql.VarChar, facturas[i][8])
        //             .input('serie', sql.VarChar, facturas[i][9])
        //             .input('numero', sql.VarChar, facturas[i][10])
        //             .input('uuid', sql.VarChar, facturas[i][11])
        //             .input('forma_pago', sql.VarChar, facturas[i][12])
        //             .input('metodo_pago', sql.VarChar, facturas[i][13])
        //             .input('cfdi', sql.VarChar, facturas[i][14])
        //             .input('km_inicial', sql.VarChar, facturas[i][15])
        //             .input('km_final', sql.VarChar, facturas[i][16])
        //             .input('cantidad', sql.VarChar, facturas[i][17])
        //             .input('factura', sql.VarChar, facturas[i][18])
        //             .input('xml', sql.VarChar, facturas[i][19])
        //             .input('comentarios', sql.Text, facturas[i][20])
        //             .input('au_liquidacion_id', sql.BigInt, id)
        //             .query(liquidacionesQueries.addFactura);
        //     }
        // }
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
        for (let i = 0; i < result2.recordset.length; i++) {
            let l = result2.recordset[i];

            /******************************************************************************************************************************
             * Subimos los Attachments
             *******************************************************************************************************************************/
            // Timestamp to avoid name duplicates
            let ts = Date.now();
            let path_ = __dirname + '/../uploads/';
            await fs.writeFile(path_ + l.IDLiquidacionDetalle + '-' + ts + '.xml', l.xml, { encoding: 'utf8' });

            let mimeType = l.factura.match(/[^:/]\w+(?=;|,)/)[0];

            let factura = l.factura.split("base64,")[1];
            await fs.writeFile(path_ + l.IDLiquidacionDetalle + '-' + ts + '.' + mimeType, factura, { encoding: 'base64' });


            // let exist = await fs.stat(path + l.IDLiquidacionDetalle + '2.xml');
            // console.log(exist);

            let upload = `<?xml version="1.0" encoding="utf-8"?>
                            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                                <soap12:Body>
                                    <AddPurchaseOrder xmlns="http://tempuri.org/wsSalesQuotation/Service1">
                                        <SessionID>D3A99297-2ABA-4082-9EB7-6F97574C978B</SessionID>
                                        <sXmlOrderObject>
                                            <![CDATA[<BOM>
                                <BO>
                                    <AdmInfo>
                                        <Object>oAttachments2</Object>
                                    </AdmInfo>
                                    <Attachments2 />
                                    <Attachments2_Lines>
                                        <row>
                                            <SourcePath>${path_}</SourcePath>
                                            <FileName>${l.IDLiquidacionDetalle}-${ts}</FileName>
                                            <FileExtension>xml</FileExtension>
                                        </row>
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
                log += `<strong>Attachment</strong>: ${rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']}<br>`;
                console.log(rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']);
                attachment = rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey'];
            } else {
                log += `<strong>Attachment Error</strong>: ${rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']}<br>`;
                // console.log(rA["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']);
            }
            /******************************************************************************************************************************
             * Subimos los Attachments
             *******************************************************************************************************************************/
            /******************************************************************************************************************************
             * Subimos la factura
             *******************************************************************************************************************************/
            let header = `<Documents>
                            <row>
                                <DocType>${l.DocType}</DocType>
                                <DocDate>${l.DocDate.toISOString().split('T')[0]}</DocDate>
                                <DocDueDate>${l.DocDueDate.toISOString().split('T')[0]}</DocDueDate>
                                <TaxDate>${l.DocTaxDate.toISOString().split('T')[0]}</TaxDate>
                                <CardCode>${l.CardCode}</CardCode>
                                <NumAtCard>${l.NumAtCard}</NumAtCard>
                                <DocCurrency>${l.DocCurrency}</DocCurrency>
                                <SalesPersonCode>${l.SalesPersonCode}</SalesPersonCode>
                                <U_FacFecha>${l.U_FacFecha.toISOString().split('T')[0]}</U_FacFecha>
                                <U_FacSerie>${l.U_FacSerie}</U_FacSerie>
                                <U_FacNum>${l.U_FacNum}</U_FacNum>
                                <U_FacNit>${l.U_facNit.trim()}</U_FacNit>
                                <U_FacNom>${l.U_facNom}</U_FacNom>
                                <U_Clase_LibroCV>${l.U_Clase_LibroCV}</U_Clase_LibroCV>
                                <U_TIPO_DOCUMENTO>${l.U_TIPO_DOCUMENTO}</U_TIPO_DOCUMENTO>
                                <Comments>${l.Comentario}</Comments>
                                <AttachmentEntry>${attachment}</AttachmentEntry>
                            </row>
                        </Documents>`;
            let body = `<row>
                            <ItemDescription>
                                ${l.ItemDescription}
                            </ItemDescription>
                            <PriceAfterVAT>
                                ${l.PriceAfVAT - l.exento}
                            </PriceAfterVAT>
                            <AccountCode>
                                ${l.afecto_codigo}
                            </AccountCode>
                            <TaxCode>
                                IVA
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
                                ${l.C5}
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
                                ${l.afecto_codigo}
                            </AccountCode>
                            <TaxCode>
                                EXE
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
                                ${l.C5}
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
            // console.log(envelope);
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
                log += `<strong>Factura</strong>: ${r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']}<br>`;
                // console.log(r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']);
            } else {
                log += `<strong>Factura Error</strong>: ${r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']}<br>`;
                // console.log(r2["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']);
            }
            /******************************************************************************************************************************
             * Subimos la factura
             *******************************************************************************************************************************/
            fs.unlink(path_ + l.IDLiquidacionDetalle + '-' + ts + '.xml');
            fs.unlink(path_ + l.IDLiquidacionDetalle + '-' + ts + '.' + mimeType);
            /******************************************************************************************************************************
             * Subimos la nota de credito
             *******************************************************************************************************************************/
            if ((l.PriceAfVAT - l.exento) > 0) {
                body = `<row>
                        <ItemDescription>
                            ${l.ItemDescription}
                        </ItemDescription>
                        <PriceAfterVAT>
                            ${l.PriceAfVAT - l.exento}
                        </PriceAfterVAT>
                        <AccountCode>
                            ${l.afecto_codigo}
                        </AccountCode>
                        <TaxCode>
                            IVA
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
                            ${l.C5}
                        </CostingCode5>
                    </row>`;
                envelope = `<?xml version="1.0" encoding="utf-8"?>
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
                    log += `<strong>Nota de Crédito</strong>: ${r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']}<br><br>`;
                    // console.log(r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['AddObjectResponse']['RetKey']);
                } else {
                    log += `<strong>Nota de Crédito Error</strong>: ${r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']}<br><br>`;
                    // console.log(r3["soap:Envelope"]["soap:Body"]['AddPurchaseOrderResponse']['AddPurchaseOrderResult']['env:Envelope']['env:Body']['env:Fault']['env:Reason']['env:Text']['$t']);
                }
            }
            /******************************************************************************************************************************
             * Subimos la nota de crédito
             *******************************************************************************************************************************/
            //  cerrarLiquidacion
            await pool
                .request()
                .input('id', sql.Int, id)
                .input('resultados', sql.Text, log)
                .query(liquidacionesQueries.cerrarLiquidacion);
        }
        res.json(true);
    } catch (err) {
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
            .input('sub_gasto_value', sql.BigInt, v[2])
            .query(liquidacionesQueries.obtener_detalle);

        let suma_cantidad = 0;
        for (let i = 0; i < result.recordset.length; i++) {
            if (tipo === "dinero") {
                suma_cantidad += parseFloat(result.recordset[i].total);
            } else {
                suma_cantidad += parseFloat(result.recordset[i].cantidad);
            }
        }

        console.log(suma_cantidad);

        // Obtenemos el sobrante de la factura que estamos ingresando
        let sobrante = cantidad_presupuestada - suma_cantidad;
        console.log(cantidad_presupuestada, suma_cantidad, sobrante);
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
                remanente = total - sobrante;
            }
        }


        // Insertamos la factura
        // let fecha = v[6].split("/");
        // fecha = fecha[2] + '-' + fecha[1] + '-' + fecha[0];
        await pool
            .request()
            .input('gasto_value', sql.BigInt, v[0])
            .input('gasto_label', sql.VarChar, v[1])
            .input('sub_gasto_value', sql.BigInt, v[2])
            .input('sub_gasto_label', sql.VarChar, v[3])
            .input('proveedor_value', sql.BigInt, v[4])
            .input('proveedor_label', sql.VarChar, v[5])
            .input('date', sql.Date, v[6])
            .input('total', sql.Numeric, v[7])
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
            .input('presupuesto_monto', sql.Numeric, v[27])
            .input('reembolso', sql.Numeric, reembolso)
            .input('remanente', sql.Numeric, remanente)
            .input('exento', sql.Numeric, v[29])
            .input('afecto', sql.Numeric, v[30])
            .input('au_usuario_id', sql.BigInt, v[31])
            .query(liquidacionesQueries.addFactura);

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

    console.log(del, al);
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
            remanente = -sum_cantidad;
        }

        // Update factura valores
        await pool
            .request()
            .input('reembolso', sql.BigInt, reembolso)
            .input('remanente', sql.BigInt, remanente)
            .input('id', id)
            .query(liquidacionesQueries.updateFacturasById);
    }
};
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

        // let ini = result.recordset[0].del.split('-');
        // ini = ini[2]+"-"+ini[1]+ini[0];
        // let fin = result.recordset[0].al.split('-');
        // fin = fin[2]+"-"+fin[1]+fin[0];

        // let ini = new Date(result.recordset[0].del);
        // ini = ini.getFullYear() + '-' + ("0" + (ini.getMonth() + 1)).slice(-2) + "-" + ini.getDate();
        // let fin = new Date(result.recordset[0].al);
        // fin = fin.getFullYear() + '-' + ("0" + (fin.getMonth() + 1)).slice(-2) + "-" + fin.getDate();

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

