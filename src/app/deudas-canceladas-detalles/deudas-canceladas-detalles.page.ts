import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import {File} from '@awesome-cordova-plugins/file/ngx';
import {FileOpener} from '@awesome-cordova-plugins/file-opener/ngx';
import {Screenshot} from '@ionic-native/screenshot/ngx';
import * as moment from 'moment';
import { PDFGenerator, PDFGeneratorOptions } from '@awesome-cordova-plugins/pdf-generator/ngx';

@Component({
  selector: 'app-deudas-canceladas-detalles',
  templateUrl: './deudas-canceladas-detalles.page.html',
  styleUrls: ['./deudas-canceladas-detalles.page.scss'],
})
export class DeudasCanceladasDetallesPage implements OnInit {
  paisCodigo = '595';
  url = 'https://api.whatsapp.com/send?phone=' + this.paisCodigo;

  id: string;
  idrecibido: string;
  detalle = ' ';
  clientes: any = [];
  clientesId = 0;
  productosId = 0;
  ultimoMonto = 0;
  auxIdPago = 1;

  deudas: any = [];
  lastDeudas: any = [];
  lastMonto: any = [];
  aux = 0;
  historiales: any = [];
  fecha = moment();
  valor = 1;


  seleccionarCli = 0;
  seleccionarPro = 0;
  productos: any = [];

  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  montoDeuda = 0;
  editId = 0;
  nombre: any;
  diferenciaMonto = 0;
  deudaActual = 0;
  indice = 0;
  firstId = 0;
  lastId = 0;
  lastIdLista: any = [];
  firstIdLista: any = [];

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
    this.getHistorial();
    this.getLastMonto();
    this.getLastDeudaId();
    this.getFirstDeudaId();
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

  doRefresh(event) {
    setTimeout(() => {
      this.getHistorial();
      event.target.complete();
    }, 2000);
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

  tomarScreen(){
    this.screenshot.save().then(()=>{
      alert('Guardado');
    });
  }

  generatePdf(){
    const options: PDFGeneratorOptions={
      type: 'share'
    };
    this.html = document.getElementById('content').
      innerHTML;
    this.pdf.fromData(this.html,options);
  }


}
