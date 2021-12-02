import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  nombreProducto = '';
  productos: any = [];
  editMode = false;
  editId = 0;
  textoBuscar = '';


  constructor(public database: DatabaseService, public platform: Platform) {
    this.database.createDatabase().then(() => {
      // will call get categories
      this.getProductos();
    });
  }

  ngOnInit() {}

  addProductos() {
    if (!this.nombreProducto.length) {
      alert('Ingrese el nombre del producto');
      return;
    }

    if (this.editMode) {
      // edit category
      this.database
        .editProductos(this.nombreProducto, this.editId)
        .then((data) => {
          this.nombreProducto = '';
          (this.editMode = false), (this.editId = 0);
          alert(data);
          this.getProductos();
        });
    } else {
      // add category
      this.database.addProductos(this.nombreProducto).then((data) => {
        this.nombreProducto = '';
        alert(data);
        this.getProductos();
      });
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

  deleteProductos(id: number) {
    this.database.deleteProductos(id).then((data) => {
      alert(data);
      this.getProductos();
    });
  }

  editProductos(category: any) {
    this.editMode = true;
    this.nombreProducto = category.name;
    this.editId = category.id;
  }
}
