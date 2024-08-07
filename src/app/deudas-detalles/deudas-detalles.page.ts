import { Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import * as moment from 'moment';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { PDFGenerator, PDFGeneratorOptions } from '@awesome-cordova-plugins/pdf-generator/ngx';
import {IonicSelectableComponent} from 'ionic-selectable';

@Component({
  selector: 'app-deudas-detalles',
  templateUrl: './deudas-detalles.page.html',
  styleUrls: ['./deudas-detalles.page.scss'],
})
export class DeudasDetallesPage implements OnInit {

  paisCodigo = '595';
  url = 'https://api.whatsapp.com/send?phone=' + this.paisCodigo;

  id: string;
  idrecibido: string;
  detalle = ' ';
  clientes: any = [];
  clientesId = 0;
  productosId = 0;
  ultimoMonto = 0;

  deudas: any = [];
  lastDeudas: any = [];
  lastMonto: any = [];
  historiales: any = [];
  fecha = moment();
  valor = 1;
  auxIdPago = 1;
  metodoPago: any = [];
  seleccionarMet = 0;

  seleccionarCli = 0;
  seleccionarPro = 0;
  productos: any = [];

  tipopagoId = 1;
  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  montoDeuda = 0;
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
              private activatedRoute: ActivatedRoute,
              public file: File,
              public fileOpener: FileOpener,
              public  screenshot: Screenshot,
              private pdf: PDFGenerator) {
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getLastMonto();
    this.getLastDeudaId();
    this.getFirstDeudaId();
    this.getMetodoPago();
    this.getHistorial();
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
    this.database.getFirstDeudaId(Number(this.idrecibido)).then((data) => {
      this.firstIdLista.push(data.rows.item(0));
      this.firstId = this.firstIdLista[0].id;
    });
  }

  getLastDeudaId() {
    this.database.getLastDeudaId(Number(this.idrecibido)).then((data) => {
      this.lastIdLista.push(data.rows.item(0));
      this.lastId = this.lastIdLista[0].id;
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
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.deudas.push(data.rows.item(i));
        }
      }
    });
  }

  getHistorial() {
    this.database.getHistorial().then((data) => {
      this.historiales = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.historiales.push(data.rows.item(i));
        }
      }
    });
  }

  getLastMonto() {
    this.database.getLastMonto(Number(this.idrecibido)).then((data) => {
      this.lastMonto.push(data.rows.item(0));
      this.ultimoMonto = this.lastMonto[0].monto;
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
    this.database.getMetodoPago().then((data) => {
      this.metodoPago = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.metodoPago.push(data.rows.item(i));
        }
      }
      console.log('metodoPago??',this.metodoPago);
    });
  }

  generatePdf(){
    const options: PDFGeneratorOptions={
      type: 'share',
      documentSize: 'A2'
    };
    this.html = document.getElementById('content').
      innerHTML;
    this.pdf.fromData(this.html,options);
  }


  tomarScreen(){
    this.screenshot.save().then(()=>{
      alert('Guardado');
    });
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
