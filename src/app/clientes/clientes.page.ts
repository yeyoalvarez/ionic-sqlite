import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  clienteNombre = '';
  clientes: any = [];
  productosId = 0;
  productos: any = [];

  editMode = false;
  selectedProductosId = 0;
  editId = 0;

  constructor(public database: DatabaseService) {
    this.getProductos();
    this.getClientes();
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

  addClientes() {
    if (!this.clienteNombre.length) {
      alert('Ingrese el cliente');
      return;
    }

    if (this.productosId === 0) {
      alert('Seleccionar cliente');
      return;
    }

    if (this.editMode) {
      this.database
        .editClientes(this.clienteNombre, this.productosId, this.editId)
        .then((data) => {
          this.clienteNombre = '';
          this.editMode = false;
          this.editId = 0;
          this.selectedProductosId = 0;
          alert(data);
          this.getClientes();
        });
    } else {
      // add
      this.database
        .addClientes(this.clienteNombre, this.productosId)
        .then((data) => {
          this.clienteNombre = '';
          this.productosId = 0;
          alert(data);
          this.getClientes();
        });
    }
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

  deleteClientes(id: number) {
    this.database.deleteClientes(id).then((data) => {
      alert(data);
      this.getClientes();
    });
  }

  editClientes(clientes: any) {
    this.editMode = true;
    this.selectedProductosId = clientes.productosId;
    this.clienteNombre = clientes.clientes;
    this.editId = clientes.id;
  }
}
