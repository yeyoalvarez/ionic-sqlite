import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import * as moment from 'moment';
moment.locale('es');
import {NavController, ModalController } from '@ionic/angular';



@Component({
  selector: 'app-deudas-activas',
  templateUrl: './deudas-activas.page.html',
  styleUrls: ['./deudas-activas.page.scss'],
})
export class DeudasActivasPage implements OnInit {

  clientes: any = [];
  clientesId = 0;
  productosId = 0;

  deudas: any = [];
  fecha: string;


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
              private navCtrl: NavController,
              public modalCtrl: ModalController) {
    this.getProductos();
    this.getClientes();
    this.getDeudas();
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getDeudas();
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
      this.database
        .editDeudas(this.clientesId, this.productosId, this.montoDeuda, this.editId, this.fecha)
        .then((data) => {
          this.montoDeuda = 0;
          this.editMode = false;
          this.editId = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          this.fecha = '';
          alert(data);
          this.getDeudas();
        });
    } else {
      // add
      this.database
        .addDeudas(this.clientesId, this.productosId, this.montoDeuda, this.fecha)
        .then((data) => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
          this.fecha = '';
          alert(data);
          this.getDeudas();
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

}
