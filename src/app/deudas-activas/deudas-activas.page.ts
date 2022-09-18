import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import * as moment from 'moment';
moment.locale('es');
import {ModalController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-deudas-activas',
  templateUrl: './deudas-activas.page.html',
  styleUrls: ['./deudas-activas.page.scss'],
})
export class DeudasActivasPage implements OnInit {

  idrecibido: string;
  clientes: any = [];
  clientesId = 0;
  productosId = 0;

  deudas: any = [];
  fecha: string;
  idVariable = 0;


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
  textoBuscar = '';

  constructor(public database: DatabaseService,
              public modalCtrl: ModalController,
              private activatedRoute: ActivatedRoute,
  ) {
    this.database.createDatabase().then(() => {
      this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
      this.getDeudas();
    });
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getDeudas();
  }

  moneda(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  comprarValores(valor: number){
    console.log('valor1', valor);
    console.log('idrecibido', this.idrecibido);
    if (valor === Number(this.idrecibido)){
      console.log('comparacion verdadera');
      return true;
    } else {
      console.log('comparacion falsa');
      return false;
    }
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
