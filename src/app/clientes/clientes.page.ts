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
  telefonos: any = [];
  telefono=9;
  paisCodigo = '595';

  editMode = false;
  editId = 0;
  selectedItem: any;
  textoBuscar = '';

  constructor(public database: DatabaseService) {
    this.database.createDatabase().then(() => {
      this.getClientes();
    });
  }

  ngOnInit() {}

  addClientes() {
    if (!this.clienteNombre.length) {
      alert('Ingrese el nombre del cliente');
      return;
    }
    if (this.telefono === 9) {
      alert('ingrese un numero de telefono');
      return;
    }

    if (this.editMode) {
      // edit category
      this.database
        .editClientes(this.clienteNombre, this.editId, this.telefono)
        .then((data) => {
          this.clienteNombre = '';
          this.telefono = 9;
          this.editMode = false;
          this.editId = 0;
          alert(data);
          this.getClientes();
        });
    } else {
      // add category
      this.database.addClientes(this.clienteNombre, this.telefono).then((data) => {
        this.clienteNombre = '';
        this.telefono = 9;
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
    this.telefono = cliente.telefono;
    this.editId = cliente.id;
  }


}
