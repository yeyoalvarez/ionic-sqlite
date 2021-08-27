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

  editMode = false;
  editId = 0;

  constructor(public database: DatabaseService) {
    this.getClientes();
  }

  ngOnInit() {}

  addClientes() {
    if (!this.clienteNombre.length) {
      alert('Ingrese el nombre del cliente');
      return;
    }

    if (this.editMode) {
      // edit category
      this.database
        .editClientes(this.clienteNombre, this.editId)
        .then((data) => {
          this.clienteNombre = '';
          (this.editMode = false), (this.editId = 0);
          alert(data);
          this.getClientes();
        });
    } else {
      // add category
      this.database.addClientes(this.clienteNombre).then((data) => {
        this.clienteNombre = '';
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

  editClientes(cliente: any) {
    this.editMode = true;
    this.clienteNombre = cliente.name;
    this.editId = cliente.id;
  }
}
