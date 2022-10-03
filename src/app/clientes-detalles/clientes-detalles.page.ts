import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-clientes-detalles',
  templateUrl: './clientes-detalles.page.html',
  styleUrls: ['./clientes-detalles.page.scss'],
})
export class ClientesDetallesPage implements OnInit {

  idrecibido: string;
  clientes: any = [];
  paisCodigo = '595';

  constructor(public database: DatabaseService,
              private activatedRoute: ActivatedRoute,) {
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {}


  getClienteDetalles(){
    this.database.getClienteDetalles(Number(this.idrecibido)).then((data) => {
      this.clientes.push(data.rows.item(0));
    });
  }

}
