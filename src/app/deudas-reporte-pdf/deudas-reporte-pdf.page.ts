import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import {PDFGeneratorOptions, PDFGenerator} from '@awesome-cordova-plugins/pdf-generator/ngx';
import { Screenshot } from '@ionic-native/screenshot/ngx';


@Component({
  selector: 'app-deudas-reporte-pdf',
  templateUrl: './deudas-reporte-pdf.page.html',
  styleUrls: ['./deudas-reporte-pdf.page.scss'],
})
export class DeudasReportePdfPage implements OnInit {

  textoBuscar = '';
  deudas: any = [];
  p = 1; //variable de paginacion
  idrecibido: string;
  lastId = 0;
  lastIdLista: any = [];
  html: any;
  data: any[] = [];


  constructor(public database: DatabaseService,
              private activatedRoute: ActivatedRoute,
              private pdf: PDFGenerator,
              public  screenshot: Screenshot) {
    this.database.createDatabase().then(() => {
      this.getLastDeudaId();
    });
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getLastDeudaId();
  }

  moneda(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  getLastId() {
    return Number(this.lastId);
  }

  getLastDeudaId() {
    this.database.getLastDeudaId(Number(this.idrecibido)).then((data) => {
      this.lastIdLista.push(data.rows.item(0));
      this.lastId = this.lastIdLista[0].id;
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

  generatePdf(){
    const options: PDFGeneratorOptions={
      type: 'share'
    };
    this.html = document.getElementById('content').
      innerHTML;
    this.pdf.fromData(this.html,options);
  }


  tomarScreen(){
    this.screenshot.save().then(()=>{
      alert('Guardado');
    });
  }

}
