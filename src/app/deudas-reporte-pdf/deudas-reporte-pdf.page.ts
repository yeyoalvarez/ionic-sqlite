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

  paisCodigo = '595';
  url = 'https://api.whatsapp.com/send?phone=' + this.paisCodigo;

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
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('deuda id', this.idrecibido);
  }

  ngOnInit() {
    this.getDeudas();
  }

  moneda(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  getIdDeuda() {
    return Number(this.idrecibido);
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
      type: 'share',
      documentSize: 'A6',
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
