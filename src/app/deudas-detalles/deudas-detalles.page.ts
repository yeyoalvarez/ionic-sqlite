import { Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-deudas-detalles',
  templateUrl: './deudas-detalles.page.html',
  styleUrls: ['./deudas-detalles.page.scss'],
})
export class DeudasDetallesPage implements OnInit {

  paisCodigo = '595';
  url = 'https://api.whatsapp.com/send?phone=' + this.paisCodigo;

  // Variables de control
  idrecibido: string;
  cargando = true;

  // Datos principales
  historiales: any = [];
  metodoPago: any = [];

  // Datos precalculados
  clienteNombre = '';
  productoNombre = '';
  telefonoDisplay = '';
  montoActual = 0;
  deudaCancelada = false;
  whatsappUrl = '';

  // Variables para formulario
  detalle = ' ';
  montoDeuda = 0;
  tipopagoId = 1;
  seleccionarMet = 0;

  // Variables auxiliares (obsoletas pero necesarias para métodos existentes)
  id: string;
  clientes: any = [];
  clientesId = 0;
  productosId = 0;
  ultimoMonto = 0;
  deudas: any = [];
  lastDeudas: any = [];
  lastMonto: any = [];
  fecha = moment();
  valor = 1;
  auxIdPago = 1;
  seleccionarCli = 0;
  seleccionarPro = 0;
  productos: any = [];
  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  valorTipopago = 0;
  editId = 0;
  nombre: any;
  diferenciaMonto = 0;
  deudaActual = 0;
  indice = 0;
  firstId = 0;
  lastId = 0;
  lastIdLista: any = [];
  firstIdLista: any = [];
  aux: any = [];
  html: any;
  data: any[] = [];

  constructor(public database: DatabaseService,
              private activatedRoute: ActivatedRoute) {
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('DeudasDetallesPage - Constructor - ID recibido:', this.idrecibido);
  }

  ngOnInit() {
    console.log('DeudasDetallesPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('DeudasDetallesPage - ionViewWillEnter - Cargando datos para deuda ID:', this.idrecibido);
    this.cargando = true;

    // Reiniciar variables al entrar
    this.deudaActual = 0;
    this.firstIdLista = [];
    this.lastIdLista = [];
    this.lastMonto = [];
    this.historiales = [];
    this.clienteNombre = '';
    this.productoNombre = '';
    this.telefonoDisplay = '';
    this.montoActual = 0;
    this.deudaCancelada = false;

    this.getLastMonto();
    this.getLastDeudaId();
    this.getFirstDeudaId();
    this.getMetodoPago();
    this.getHistorialByDeuda();
  }


  getIdDeuda() {
    return Number(this.idrecibido);
  }

  getLastId() {
    return Number(this.lastId);
  }

  getFirstId() {
    return Number(this.firstId);
  }

  portChangeM(event: {
    component: IonicSelectableComponent;value: any;
  }) {
    this.aux = event.value;
    this.tipopagoId = this.aux.id;
  }

  getFirstDeudaId() {
    console.log('getFirstDeudaId - Consultando para deuda:', this.idrecibido);
    this.database.getFirstDeudaId(Number(this.idrecibido)).then((data) => {
      console.log('getFirstDeudaId - Resultado:', data);
      if (data.values && data.values.length > 0) {
        this.firstIdLista.push(data.values[0]);
        this.firstId = this.firstIdLista[0].id;
        console.log('getFirstDeudaId - First ID:', this.firstId);
      } else {
        this.firstId = 0;
        console.log('getFirstDeudaId - No hay datos, usando 0');
      }
    }).catch(err => {
      console.error('getFirstDeudaId - Error:', err);
    });
  }

  getLastDeudaId() {
    console.log('getLastDeudaId - Consultando para deuda:', this.idrecibido);
    this.database.getLastDeudaId(Number(this.idrecibido)).then((data) => {
      console.log('getLastDeudaId - Resultado:', data);
      if (data.values && data.values.length > 0) {
        this.lastIdLista.push(data.values[0]);
        this.lastId = this.lastIdLista[0].id;
        console.log('getLastDeudaId - Last ID:', this.lastId);
      } else {
        this.lastId = 0;
        console.log('getLastDeudaId - No hay datos, usando 0');
      }
    }).catch(err => {
      console.error('getLastDeudaId - Error:', err);
    });
  }


  moneda(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  editDeudas(deudas: any, operacion: number) {
    /* Verificar datos de disminuir deuda*/
    if(this.montoDeuda === 0) {
      alert('Ingrese el monto');
      return;
    }

    if (operacion === 1) {
      if (this.montoDeuda > deudas.montos) {
        alert('error al ingresar monto');
        return;
      }
      if (this.montoDeuda < 1) {
        alert('error al ingresar monto');
        return;
      }
    }

    /* verificar datos de aumentar deuda*/
    if (operacion === 2) {
      if (this.montoDeuda <= 0) {
        alert('error al ingresar monto');
        return;
      }
    }

    /*verificar metodo de pago*/
    if (operacion === 2) {
      if (this.montoDeuda <= 0) {
        alert('error al ingresar monto');
        return;
      }
    }

    console.log(this.montoDeuda);
    console.log('monto a pagar');
    console.log(deudas.montos);

    /*si se disminuira la deuda y es el monto total, se cancelara*/
    if (Number(deudas.montos) === Number(this.montoDeuda)
      && operacion === 1 ){
      this.database
        .deudaCancelada(0, this.getIdDeuda(), moment().format('DD/MM/YY'), this.tipopagoId)
        .then((data) => {
          this.addHistorial(deudas, 1);
          this.montoDeuda = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          this.tipopagoId = 1;
          console.log('disminuir');
          alert(data);
        });
      /*si disminuira la deuda, pero no es el monto total adeudado*/
    }else if(operacion === 1){
      this.database
        .editDeudas(deudas.montos-this.montoDeuda, this.getIdDeuda(),
          moment().format('DD/MM/YY'), this.tipopagoId)
        .then((data) => {
          this.addHistorial(deudas, 1);
          this.montoDeuda = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          this.tipopagoId = 1;
          this.detalle = ' ';
          console.log('disminuir');
          alert(data);
        });
      /*si se aumentara la deuda*/
    }else if(operacion === 2){
      this.database
        .editDeudas( Number(deudas.montos)+Number(this.montoDeuda), this.getIdDeuda(),
          moment().format('DD/MM/YY'), this.tipopagoId)
        .then((data) => {
          this.addHistorial(deudas, 2);
          this.montoDeuda = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          this.detalle = ' ';
          this.tipopagoId = 1;
          alert(data);
        });
    }
  }

  addHistorial(deudas: any, operacion: number) {
    /*si se reduce la deuda*/
    if (operacion === 1){
      this.database
        .addHistorial(deudas.idCliente, deudas.idProducto, this.getIdDeuda(),deudas.montos-this.montoDeuda,
          moment().format('DD/MM/YY'), this.detalle, this.tipopagoId)
        .then(() => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
          this.detalle = ' ';
          this.tipopagoId = 1;
        });
      /*si es una suma de deuda*/
    }else if (operacion === 2){
      this.database
        .addHistorial(deudas.idCliente, deudas.idProducto, this.getIdDeuda(),
          Number(deudas.montos)+Number(this.montoDeuda),
          moment().format('DD/MM/YY'), this.detalle, this.tipopagoId)
        .then(() => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
          this.detalle = ' ';
          this.tipopagoId = 1;
        });
    }

  }

  getDeudas() {
    this.database.getDeudas().then((data) => {
      this.deudas = [];
      if (data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.deudas.push(data.values[i]);
        }
      }
    });
  }

  getHistorialByDeuda() {
    console.log('getHistorialByDeuda - Consultando historial para deuda:', this.idrecibido);
    this.database.getHistorialByDeuda(Number(this.idrecibido)).then((data) => {
      console.log('getHistorialByDeuda - Resultado:', data);
      this.historiales = [];
      if (data.values && data.values.length > 0) {
        let montoAnterior = 0;

        for (let i = 0; i < data.values.length; i++) {
          const item = { ...data.values[i] };

          // Calcular el pago/incremento respecto al anterior
          if (i === 0) {
            item.pagoAnterior = 0;
            item.diferencia = item.montos;
          } else {
            item.diferencia = item.montos - montoAnterior;
            item.pagoAnterior = -item.diferencia;
          }

          montoAnterior = item.montos;
          this.historiales.push(item);
        }

        this.precalcularDatos();
        console.log('getHistorialByDeuda - Total registros:', this.historiales.length);
        console.log('getHistorialByDeuda - Historial procesado con diferencias');
      } else {
        console.log('getHistorialByDeuda - No hay registros');
      }
      this.cargando = false;
    }).catch(err => {
      console.error('getHistorialByDeuda - Error:', err);
      this.cargando = false;
    });
  }

  precalcularDatos() {
    if (!this.historiales || this.historiales.length === 0) return;

    console.log('DeudasDetallesPage - precalcularDatos - Procesando datos');

    // Datos del cliente y producto (del primer registro)
    const primerRegistro = this.historiales[0];
    this.clienteNombre = primerRegistro.clientes || 'Sin nombre';
    this.productoNombre = primerRegistro.productos || 'Sin producto';
    this.telefonoDisplay = primerRegistro.telefono
      ? `${this.paisCodigo} ${primerRegistro.telefono}`
      : 'Sin teléfono';

    // Datos del último registro (estado actual)
    const ultimoRegistro = this.historiales[this.historiales.length - 1];
    this.montoActual = ultimoRegistro.montos || 0;
    this.deudaCancelada = this.montoActual === 0;

    // WhatsApp URL
    this.whatsappUrl = primerRegistro.telefono
      ? `${this.url}${primerRegistro.telefono}`
      : '';

    console.log('DeudasDetallesPage - precalcularDatos - Datos procesados:', {
      cliente: this.clienteNombre,
      producto: this.productoNombre,
      monto: this.montoActual,
      cancelada: this.deudaCancelada
    });
  }

  getLastMonto() {
    console.log('getLastMonto - Consultando para deuda:', this.idrecibido);
    this.database.getLastMonto(Number(this.idrecibido)).then((data) => {
      console.log('getLastMonto - Resultado:', data);
      if (data.values && data.values.length > 0) {
        this.lastMonto.push(data.values[0]);
        this.ultimoMonto = this.lastMonto[0].monto;
        console.log('getLastMonto - Último monto:', this.ultimoMonto);
      } else {
        this.ultimoMonto = 0;
        console.log('getLastMonto - No hay datos, usando 0');
      }
    }).catch(err => {
      console.error('getLastMonto - Error:', err);
    });
  }

  pagoAnterior(x){
    if (x === this.deudaActual){
      return 0;
    }else{
      this.diferenciaMonto = this.deudaActual-x;
      this.deudaActual = this.deudaActual - this.diferenciaMonto;
    }
    return Number(this.diferenciaMonto *-1);
  }

  pagoAnteriorConsulta(x){
    if (x === this.deudaActual){
      return 0;
    }else{
      this.diferenciaMonto = this.deudaActual-x;
    }
    return Number(this.diferenciaMonto *-1);
  }

  getMetodoPago(){
    console.log('getMetodoPago - Consultando métodos de pago');
    this.database.getMetodoPago().then((data) => {
      console.log('getMetodoPago - Resultado:', data);
      this.metodoPago = [];
      if (data.values && data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.metodoPago.push(data.values[i]);
        }
        console.log('getMetodoPago - Total métodos:', this.metodoPago.length, this.metodoPago);
      } else {
        console.log('getMetodoPago - No hay métodos de pago');
      }
    }).catch(err => {
      console.error('getMetodoPago - Error:', err);
    });
  }

  crearContenidoParaCaptura(): HTMLElement {
    // Crear un contenedor temporal con HTML puro (sin Web Components)
    const container = document.createElement('div');
    container.style.cssText = `
      width: 400px;
      padding: 20px;
      background: #f5f5f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    // Header del cliente
    if (this.historiales.length > 0) {
      const header = document.createElement('div');
      header.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      `;
      header.innerHTML = `
        <div style="font-size: 1.3rem; font-weight: 600; color: #3880ff; margin-bottom: 8px;">
          👤 ${this.historiales[0]?.clientes}
        </div>
        <div style="font-size: 0.95rem; color: #666; margin-bottom: 8px;">
          📦 ${this.historiales[0]?.productos}
        </div>
        <div style="color: #28ba62; font-size: 1rem; font-weight: 500;">
          📞 ${this.paisCodigo} ${this.historiales[0]?.telefono}
        </div>
      `;
      container.appendChild(header);
    }

    // Timeline de transacciones
    const timeline = document.createElement('div');
    timeline.style.cssText = 'position: relative; padding-left: 40px;';

    // Línea vertical
    const line = document.createElement('div');
    line.style.cssText = `
      position: absolute;
      left: 24px;
      top: 0;
      bottom: 60px;
      width: 2px;
      background: linear-gradient(to bottom, #3880ff, #28ba62);
    `;
    timeline.appendChild(line);

    // Transacciones
    this.historiales.forEach((historial: any, i: number) => {
      const card = document.createElement('div');
      card.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        position: relative;
      `;

      // Icono
      const icon = document.createElement('div');
      icon.style.cssText = `
        position: absolute;
        left: -40px;
        top: 16px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        ${i === 0 ? 'background: linear-gradient(135deg, #3880ff, #2563d4);' : 'background: white;'}
      `;
      icon.textContent = historial.diferencia > 0 ? '🔴' : '🟢';
      card.appendChild(icon);

      // Contenido del card
      const content = document.createElement('div');
      content.style.cssText = 'padding-left: 16px;';

      const header = document.createElement('div');
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;
      `;
      header.innerHTML = `
        <span style="font-size: 0.9rem; color: #666;">📅 ${historial.fechas}</span>
        <span style="background: #ddd; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem;">${historial.tipopago}</span>
      `;
      content.appendChild(header);

      // Detalles
      const details = document.createElement('div');

      if (i === 0) {
        details.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 0.9rem;">Monto inicial:</span>
            <span style="color: #3880ff; font-weight: 600;">Gs. ${this.moneda(historial.montos)}</span>
          </div>
        `;
      } else {
        const label = historial.diferencia < 0 ? 'Pago realizado:' : 'Mercadería agregada:';
        const color = historial.diferencia < 0 ? '#28ba62' : '#eb445a';
        details.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 0.9rem;">${label}</span>
            <span style="color: ${color}; font-weight: 600;">Gs. ${this.moneda(historial.pagoAnterior)}</span>
          </div>
        `;
      }

      details.innerHTML += `
        <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e0e0e0;">
          <span style="color: #666; font-size: 0.9rem;">Saldo:</span>
          <span style="color: #000; font-weight: 600; font-size: 1.1rem;">Gs. ${this.moneda(historial.montos)}</span>
        </div>
      `;

      if (historial.detalles && historial.diferencia > 0 && i !== 0) {
        details.innerHTML += `
          <div style="margin-top: 12px; padding: 12px; background: #f9f9f9; border-radius: 8px; font-size: 0.85rem; color: #666;">
            📝 ${historial.detalles}
          </div>
        `;
      }

      content.appendChild(details);
      card.appendChild(content);
      timeline.appendChild(card);
    });

    container.appendChild(timeline);

    // Badge de estado
    if (this.historiales.length > 0) {
      const lastMonto = this.historiales[this.historiales.length - 1]?.montos;
      const badge = document.createElement('div');
      badge.style.cssText = `
        text-align: center;
        padding: 16px;
      `;

      if (lastMonto !== 0) {
        badge.innerHTML = `
          <div style="display: inline-block; background: #ffc409; color: white; padding: 8px 16px; border-radius: 20px; font-size: 1rem;">
            ⏰ Deuda Activa
          </div>
        `;
      } else {
        badge.innerHTML = `
          <div style="display: inline-block; background: #28ba62; color: white; padding: 8px 16px; border-radius: 20px; font-size: 1rem;">
            ✓ Deuda Cancelada
          </div>
        `;
      }

      container.appendChild(badge);
    }

    return container;
  }

  async generatePdf() {
    let tempContainer: HTMLElement | null = null;
    try {
      console.log('generatePdf - Iniciando generación');

      // Crear contenido temporal renderizable
      tempContainer = this.crearContenidoParaCaptura();
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);

      console.log('generatePdf - Contenedor temporal creado');
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempContainer, {
        scale: 1.5, // Reducido de 2 a 1.5 para evitar congelamientos
        backgroundColor: '#f5f5f5',
        logging: false
      });

      console.log('generatePdf - Canvas generado:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Si la imagen cabe en una sola página
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Si necesita múltiples páginas
        let heightLeft = imgHeight;
        let position = 0;

        // Primera página
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Páginas adicionales
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      const pdfOutput = pdf.output('datauristring');
      const base64 = pdfOutput.split(',')[1];

      const fileName = `deuda_detalles_${Date.now()}.pdf`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache
      });

      await Share.share({
        title: 'Reporte de Deuda',
        url: savedFile.uri,
        dialogTitle: 'Compartir PDF'
      });

      console.log('generatePdf - Compartido exitosamente');
    } catch (error) {
      console.error('generatePdf - Error:', error);
      alert('Error al generar PDF: ' + ((error as Error).message || 'desconocido'));
    } finally {
      // Limpiar el contenedor temporal
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
    }
  }


  crearBoletaParaCaptura(): HTMLElement {
    // Crear boleta completa con todas las transacciones
    const container = document.createElement('div');
    container.style.cssText = `
      width: 380px;
      padding: 15px;
      background: white;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    if (this.historiales.length === 0) return container;

    // Header tipo boleta
    const header = document.createElement('div');
    header.style.cssText = `
      border-bottom: 2px solid #3880ff;
      padding-bottom: 10px;
      margin-bottom: 10px;
    `;
    header.innerHTML = `
      <div style="text-align: center; font-size: 1.2rem; font-weight: 700; color: #3880ff; margin-bottom: 8px;">
        ESTADO DE CUENTA
      </div>
      <div style="font-size: 0.95rem; font-weight: 600; margin-bottom: 3px;">
        Cliente: ${this.historiales[0]?.clientes}
      </div>
      <div style="font-size: 0.85rem; color: #666; margin-bottom: 3px;">
        Producto: ${this.historiales[0]?.productos}
      </div>
      <div style="font-size: 0.85rem; color: #666;">
        Teléfono: ${this.paisCodigo} ${this.historiales[0]?.telefono}
      </div>
    `;
    container.appendChild(header);

    // Tabla de transacciones
    const tabla = document.createElement('div');
    tabla.style.cssText = 'margin-bottom: 10px;';

    // Header de tabla
    const tablaHeader = document.createElement('div');
    tablaHeader.style.cssText = `
      display: grid;
      grid-template-columns: 60px 1fr 75px;
      gap: 4px;
      padding: 6px 0;
      border-bottom: 1px solid #ddd;
      font-size: 0.7rem;
      font-weight: 600;
      color: #666;
    `;
    tablaHeader.innerHTML = `
      <div>Fecha</div>
      <div>Detalle</div>
      <div style="text-align: right;">Monto</div>
    `;
    tabla.appendChild(tablaHeader);

    // Filas de transacciones
    this.historiales.forEach((historial: any, i: number) => {
      const fila = document.createElement('div');
      fila.style.cssText = `
        display: grid;
        grid-template-columns: 60px 1fr 75px;
        gap: 4px;
        padding: 5px 0;
        border-bottom: 1px dotted #eee;
        font-size: 0.7rem;
      `;

      let detalle = '';
      let monto = '';
      let colorMonto = '#000';

      // Formatear fecha a formato corto (solo 2 dígitos del año)
      let fechaCorta = historial.fechas;
      if (fechaCorta.includes('/')) {
        const partes = fechaCorta.split('/');
        if (partes.length === 3 && partes[2].length === 4) {
          // Si el año tiene 4 dígitos, tomar solo los últimos 2
          fechaCorta = `${partes[0]}/${partes[1]}/${partes[2].slice(-2)}`;
        }
      }

      if (i === 0) {
        detalle = historial.detalles || 'Deuda inicial';
        monto = this.moneda(historial.montos);
        colorMonto = '#3880ff';
      } else if (historial.diferencia < 0) {
        detalle = historial.detalles || 'Pago';
        monto = '- ' + this.moneda(historial.pagoAnterior);
        colorMonto = '#28ba62';
      } else {
        detalle = historial.detalles || 'Compra';
        monto = '+ ' + this.moneda(historial.pagoAnterior);
        colorMonto = '#eb445a';
      }

      fila.innerHTML = `
        <div style="color: #666;">${fechaCorta}</div>
        <div style="color: #333;">${detalle}</div>
        <div style="text-align: right; font-weight: 600; color: ${colorMonto};">
          ${monto}
        </div>
      `;

      tabla.appendChild(fila);
    });

    container.appendChild(tabla);

    // Footer con saldo final
    const ultima = this.historiales[this.historiales.length - 1];
    const footer = document.createElement('div');
    footer.style.cssText = `
      border-top: 2px solid #3880ff;
      padding-top: 10px;
      margin-top: 10px;
    `;
    footer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 1rem; font-weight: 700;">SALDO FINAL:</span>
        <span style="font-size: 1.2rem; font-weight: 700; color: ${ultima.montos === 0 ? '#28ba62' : '#ffc409'};">
          Gs. ${this.moneda(ultima.montos)}
        </span>
      </div>
      <div style="text-align: center; margin-top: 8px;">
        <span style="display: inline-block; background: ${ultima.montos === 0 ? '#28ba62' : '#ffc409'}; color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.75rem; font-weight: 600;">
          ${ultima.montos === 0 ? '✓ CANCELADA' : '⏰ ACTIVA'}
        </span>
      </div>
      <div style="text-align: center; font-size: 0.65rem; color: #999; margin-top: 10px;">
        Total de transacciones: ${this.historiales.length}
      </div>
    `;
    container.appendChild(footer);

    return container;
  }

  async tomarScreen() {
    let tempContainer: HTMLElement | null = null;
    try {
      console.log('tomarScreen - Iniciando captura tipo boleta');

      // Crear boleta completa con todas las transacciones
      tempContainer = this.crearBoletaParaCaptura();
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);

      console.log('tomarScreen - Boleta creada');
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempContainer, {
        scale: 2.5, // Alta calidad pero optimizado para boletas largas
        backgroundColor: 'white',
        logging: false
      });

      console.log('tomarScreen - Canvas generado:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const base64 = imgData.split(',')[1];

      const fileName = `deuda_detalles_${Date.now()}.png`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache
      });

      await Share.share({
        title: 'Detalle de Deuda',
        url: savedFile.uri,
        dialogTitle: 'Compartir Imagen'
      });

      console.log('tomarScreen - Compartido exitosamente');
    } catch (error) {
      console.error('tomarScreen - Error:', error);
      alert('Error al capturar: ' + ((error as Error).message || 'desconocido'));
    } finally {
      // Limpiar el contenedor temporal
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
    }
  }

  confirmarPagoDeuda(historial: any, operacion: number) {
    let mensaje = '';
    if (operacion === 1) {
      mensaje = `¿Está seguro que desea realizar el pago de deuda por el monto de ${this.moneda(this.montoDeuda)}?`;
    } else if (operacion === 2) {
      mensaje = `¿Está seguro que desea aumentar la deuda por el monto de ${this.moneda(this.montoDeuda)}?`;
    }

    if (confirm(mensaje)) {
      this.editDeudas(historial, operacion);
    }
  }



}
