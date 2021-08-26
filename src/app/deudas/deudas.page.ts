import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';

@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.page.html',
  styleUrls: ['./deudas.page.scss'],
})
export class DeudasPage implements OnInit {
  clienteNombre = '';
  clientes: any = [];
  productosId = 0;
  productos: any = [];
  clientesId = 0;
  deudas: any = [];
  montoDeuda = 0;

  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  editId = 0;

  constructor(public database: DatabaseService) {
    this.getProductos();
    this.getClientes();
    this.getDeudas();
  }

  ngOnInit() {}

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
        .editDeudas(this.clientesId, this.productosId, this.montoDeuda, this.editId)
        .then((data) => {
          this.montoDeuda = 0;
          this.editMode = false;
          this.editId = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          alert(data);
          this.getDeudas();
        });
    } else {
      // add
      this.database
        .addDeudas(this.clientesId, this.productosId, this.montoDeuda)
        .then((data) => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
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
    this.montoDeuda = deudas.deudas;
    this.editId = deudas.id;
  }

}

