import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-deudas-detalles',
  templateUrl: './deudas-detalles.page.html',
  styleUrls: ['./deudas-detalles.page.scss'],
})
export class DeudasDetallesPage implements OnInit {

  paisCodigo = '595';
  url = 'https://api.whatsapp.com/send?phone='+this.paisCodigo;

  id: string;
  idrecibido: string;
  clientes: any = [];
  clientesId = 0;
  productosId = 0;
  ultimoMonto = 0;

  deudas: any = [];
  lastDeudas: any = [];
  lastMonto: any = [];
  aux = 0;
  historiales: any = [];
  //fecha: string;
  fecha = moment();
  estado = false;
  permiso = true;


  seleccionarCli = 0;
  seleccionarPro = 0;
  productos: any = [];

  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  montoDeuda = 0;
  editId = 0;

  items: any[] = [];

  constructor(public database: DatabaseService,
              private activatedRoute: ActivatedRoute,
              private screenshot: Screenshot,
              private androidPermissions: AndroidPermissions,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
    this.getHistorial();
  }

  ionViewWillEnter() {
    this.getHistorial();
  }

  getDato(){
    return 0;
  }

  getIdDeuda(){
    return Number(this.idrecibido);
  }

  getMonto(){
    return Number(this.idrecibido);
  }

  ciclos(){
    this.permiso = false;
  }

  cambioFecha(event){
    console.log('Date', new Date (event.detail.value.format('Do MM YY')));

  }

  moneda(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  editDeudas(deudas: any) {
    if (this.montoDeuda > deudas.montos) {
      alert('error al ingresar monto');
      return;
    }
    if (this.montoDeuda < 1) {
      alert('error al ingresar monto');
      return;
    }
      this.database
        .editDeudas(deudas.idCliente, deudas.productosId, deudas.montos-this.montoDeuda, this.getIdDeuda(),
          moment().format('L'))
        .then((data) => {
          this.addHistorial(deudas);
          this.montoDeuda = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          alert(data);
        });
  }

  addHistorial(deudas: any) {
    this.database
      .addHistorial(deudas.idCliente, deudas.idProducto, this.getIdDeuda(),deudas.montos-this.montoDeuda,
        moment().format('L'))
      .then((data) => {
        this.montoDeuda = 0;
        this.productosId = 0;
        this.clientesId = 0;
        alert(data);
      });
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
      console.log('historial dentro');
      console.log(this.historiales);
    });
    console.log('historial');
    console.log(this.historiales);
  }

  deleteDeudas(id: number) {
    this.database.deleteDeudas(id).then((data) => {
      alert(data);
      this.getDeudas();
    });
  }

  capturaPantalla(){
    this.screenshot.save('jpg', 80, 'deuda.jpg').then(() => {
      alert('Guardado en el telefono');
      }).catch(e => console.log(e));
  }

  getLastDeuda() {
    this.database.getLastDeuda().then((data) => {
      this.lastDeudas = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.lastDeudas.push(data.rows.item(i));
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

}
