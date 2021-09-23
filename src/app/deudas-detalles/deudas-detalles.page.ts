import { Component, OnInit } from '@angular/core';
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
  clientes: any = [];
  clientesId = 0;
  productosId = 0;

  deudas: any = [];
  historiales: any = [];
  //fecha: string;
  fecha = moment();
  estado = false;


  seleccionarCli = 0;
  seleccionarPro = 0;
  productos: any = [];
  aux: any = [];

  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  montoDeuda = 0;
  editId = 0;

  items: any[] = [];

  constructor(public database: DatabaseService,
              private activatedRoute: ActivatedRoute,
              private screenshot: Screenshot,
              private androidPermissions: AndroidPermissions) {
    this.getProductos();
    this.getClientes();
    this.getDeudas();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  llamarDato(){
    return Number(this.id);
  }

  ionViewWillEnter() {
    this.getDeudas();
    this.getHistorial();
  }

  cambioFecha(event){
    console.log('ionChange', event);
    console.log('Date', new Date (event.detail.value.format('Do MM YY')));

  }

  moneda(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  getProductos() {
    this.database.getProductos().then((data) => {
      this.productos = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.productos.push(data.rows.item(i));
        }
      }
    });
  }

  getClientes() {
    this.database.getClientes().then((data) => {
      this.clientes = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.clientes.push(data.rows.item(i));
        }
      }
    });
  }

  editDeudas(deudas: any) {

    console.log(deudas);
    if (this.montoDeuda <= deudas.montoDeuda && this.montoDeuda > 0) {
      alert('Ingrese el Monto de la Deuda');
      return;
    }
      this.database
        .editDeudas(deudas.idCliente, deudas.productosId, this.montoDeuda, deudas.id,
          this.fecha.format('Do MM YY'))
        .then((data) => {
          this.addHistorial(deudas);
          this.montoDeuda = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          alert(data);
        });
  }

  addHistorial(deudas: any) {
    // add
    this.database
      .addHistorial(deudas.idCliente, deudas.productosId, this.montoDeuda,
        this.fecha.format('L'))
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
    });
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



}
