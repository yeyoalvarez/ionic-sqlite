import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-deudas-canceladas',
  templateUrl: './deudas-canceladas.page.html',
  styleUrls: ['./deudas-canceladas.page.scss'],
})
export class DeudasCanceladasPage implements OnInit {

  idrecibido: string;
  id: string;
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
              private activatedRoute: ActivatedRoute,
  ) {
    this.database.createDatabase().then(() => {
      this.getDeudasCanceladas();
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getDeudasCanceladas();
  }

  getDeudasCanceladas() {
    this.database.getDeudasCanceladas().then((data) => {
      this.deudas = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.deudas.push(data.rows.item(i));
        }
      }
    });
  }

}
