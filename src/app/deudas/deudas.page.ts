import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as moment from 'moment';

@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.page.html',
  styleUrls: ['./deudas.page.scss'],
})

export class DeudasPage implements OnInit {

  clientes: any = [];
  clientesId = 0;
  productosId = 0;
  idDeuda: any = [];
  id = 0;
  auxId = 0;

  deudas: any = [];
  historiales: any = [];
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

  constructor(public database: DatabaseService) {
    this.getProductos();
    this.getClientes();
    this.getDeudas();
  }



  ngOnInit() {

  }

  cambioFecha(event){
    console.log('ionChange', event);
    console.log('Date', new Date (event.detail.value.format('Do MM YY')));

  }

  ionViewWillEnter() {
  }

  getId(x){
    this.auxId = Number(x);
  }

  portChangeC(event: {
    component: IonicSelectableComponent;value: any;
  }) {
    this.aux = event.value;
    this.clientesId = this.aux.id;
  }

  portChangeP(event: {
    component: IonicSelectableComponent;value: any;
  }) {
    this.aux = event.value;
    this.productosId = this.aux.id;
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

  addDeudas() {
    if (this.clientesId === 0) {
      alert('Seleccionar el cliente');
      return;
    }

    if (this.productosId === 0) {
      alert('Seleccionar el producto');
      return;
    }

    if (this.montoDeuda === 0) {
      alert('Ingrese el Monto de la Deuda');
      return;
    }

    if (this.editMode) {
      if (this.estado === true){
      this.database
        .editDeudas(this.clientesId, this.productosId, this.montoDeuda, this.editId,
          this.fecha.format('L'))
        .then((data) => {
          this.montoDeuda = 0;
          this.editMode = false;
          this.editId = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          alert(data);
        });
      }} else {
      this.database
        .addDeudas(this.clientesId, this.productosId, this.montoDeuda,
          this.fecha.format('L'))
        .then((data) => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
          alert(data);
        });

      console.log('funcion await');
      this.getIdMax();

      this.database
        .addHistorial(this.clientesId, this.productosId,this.auxId+1,this.montoDeuda,
          this.fecha.format('L'))
        .then((data) => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
          alert(data);
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

  editDeudas(deudas: any) {
    this.editMode = true;
    this.selectedClientesId = deudas.clientesId;
    this.selectedProductosId = deudas.productosId;
    this.montoDeuda = deudas.montoDeuda;
    this.editId = deudas.id;
    this.fecha = deudas.fecha;
  }

  deleteDeudas(id: number) {
    this.database.deleteDeudas(id).then((data) => {
      alert(data);
      this.getDeudas();
    });
  }

  getLastDeuda() {
    this.database.getLastDeuda().then((data) => {
      this.idDeuda = [];
          this.idDeuda.push(data.rows.item(0));
        return this.idDeuda[0].id;
    });
  };

  async getIdMax(){
    try{
      const datos = await this.getLastDeuda();
      console.log(datos);
    }catch (err){
      console.log(err);
    }
  }

}

