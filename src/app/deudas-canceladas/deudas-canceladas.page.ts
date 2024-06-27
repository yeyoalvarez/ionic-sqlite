import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deudas-canceladas',
  templateUrl: './deudas-canceladas.page.html',
  styleUrls: ['./deudas-canceladas.page.scss'],
})
export class DeudasCanceladasPage implements OnInit {
  idrecibido: string;
  deudas: any = [];
  textoBuscar = '';
  p = 1; // Variable de paginación

  constructor(
    public database: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {
    this.database.createDatabase().then(() => {
      this.getDeudasCanceladas();
    });
  }

  ngOnInit() {}

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
