import { Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-deudas-detalles',
  templateUrl: './deudas-detalles.page.html',
  styleUrls: ['./deudas-detalles.page.scss'],
})
export class DeudasDetallesPage implements OnInit {

  paisCodigo = '595';
  url = 'https://api.whatsapp.com/send?phone=' + this.paisCodigo;

  id: string;
  idrecibido: string;
  clientes: any = [];
  clientesId = 0;
  productosId = 0;
  ultimoMonto = 0;

  deudas: any = [];
  lastDeudas: any = [];
  lastMonto: any = [];
  aux = 0;
  historiales: any = [];
  fecha = moment();
  valor = 1;


  seleccionarCli = 0;
  seleccionarPro = 0;
  productos: any = [];

  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  montoDeuda;
  editId = 0;
  nombre: any;
  firstMonto: any = [];
  primermonto = 0;
  diferenciaMonto = 0;
  deudaActual = 0;


  items: any[] = [];
  pdfObject: any;


  constructor(public database: DatabaseService,
              private activatedRoute: ActivatedRoute,
              public file: File,
              public fileOpener: FileOpener) {
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getHistorial();
    this.getLastMonto();
    this.getFirstMonto();
  }


  getIdDeuda() {
    return Number(this.idrecibido);
  }

  getMonto() {
    return Number(this.idrecibido);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getHistorial();
      event.target.complete();
    }, 2000);
  }

  cambioFecha(event) {
    console.log('Date', new Date(event.detail.value.format('Do MM YY')));

  }

  moneda(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  editDeudas(deudas: any) {
    if (this.montoDeuda > deudas.montos) {
      alert('error al ingresar monto');
      return;
    }
    if (this.montoDeuda < 1) {
      alert('error al ingresar monto');
      return;
    }

    console.log(this.montoDeuda);
    console.log('monto a pagar');
    console.log(deudas.montos);
    if (Number(deudas.montos) === Number(this.montoDeuda)){
      this.database
        .deudaCancelada(0, this.getIdDeuda())
        .then((data) => {
          this.addHistorial(deudas);
          this.montoDeuda = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          alert(data);
        });

    }else{

      this.database
        .editDeudas(deudas.montos-this.montoDeuda, this.getIdDeuda())
        .then((data) => {
          this.addHistorial(deudas);
          this.montoDeuda = 0;
          this.selectedProductosId = 0;
          this.selectedClientesId = 0;
          alert(data);
        });
    }
  }

  addHistorial(deudas: any) {
    this.database
      .addHistorial(deudas.idCliente, deudas.idProducto, this.getIdDeuda(),deudas.montos-this.montoDeuda,
        moment().format('DD/MM/YY'))
      .then(() => {
        this.montoDeuda = 0;
        this.productosId = 0;
        this.clientesId = 0;
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

  getHistorial() {
    this.database.getHistorial().then((data) => {
      this.historiales = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.historiales.push(data.rows.item(i));
        }
      }
    });
  }

  deleteDeudas(id: number) {
    this.database.deleteDeudas(id).then((data) => {
      alert(data);
      this.getDeudas();
    });
  }

  getLastMonto() {
    this.database.getLastMonto(Number(this.idrecibido)).then((data) => {
      this.lastMonto.push(data.rows.item(0));
      this.ultimoMonto = this.lastMonto[0].monto;
    });
  }

  getFirstMonto() {
    this.database.getFirsMonto(Number(this.idrecibido)).then((data) => {
      this.firstMonto.push(data.rows.item(0));
      this.primermonto = this.firstMonto[0].monto;
      this.deudaActual = this.primermonto;
    });
  }

  pagoAnterior(x){
    if (x === this.deudaActual){
      return 0;
    }else{
      this.diferenciaMonto = this.deudaActual-x;
      this.deudaActual = this.deudaActual - this.diferenciaMonto;
    }
    return this.diferenciaMonto;
  }

  generarPDF(){
    const definirDocumento = {
      content: [
        {text: 'Tables', style: 'header'},
        'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
        {text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader'},
      ]
    };

    //   const definirDocumento = { content: [
    //     {
    //       text: 'ELECTRONIC SHOP',
    //       fontSize: 16,
    //       alignment: 'center',
    //       color: '#047886'
    //     },
    //     {
    //       text: 'INVOICE',
    //       fontSize: 20,
    //       bold: true,
    //       alignment: 'center',
    //       decoration: 'underline',
    //       color: 'skyblue'
    //     },
    //     {
    //       text: 'Customer Details',
    //       style: 'sectionHeader'
    //     },
    //     {
    //       columns: [
    //         [
    //           {
    //             text: this.invoice.customerName,
    //             bold:true
    //           },
    //           { text: this.invoice.address },
    //           { text: this.invoice.email },
    //           { text: this.invoice.contactNo }
    //         ],
    //         [
    //           {
    //             text: `Date: ${new Date().toLocaleString()}`,
    //             alignment: 'right'
    //           },
    //           {
    //             text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
    //             alignment: 'right'
    //           }
    //         ]
    //       ]
    //     },
    //     {
    //       text: 'Order Details',
    //       style: 'sectionHeader'
    //     },
    //     {
    //       table: {
    //         headerRows: 1,
    //         widths: ['*', 'auto', 'auto', 'auto'],
    //         body: [
    //           ['Product', 'Price', 'Quantity', 'Amount'],
    //           ...this.invoice.products.map(p => ([p.name, p.price, p.qty, (p.price*p.qty).toFixed(2)])),
    // eslint-disable-next-line max-len
    //           [{text: 'Total Amount', colSpan: 3}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
    //         ]
    //       }
    //     },
    //     {
    //       text: 'Additional Details',
    //       style: 'sectionHeader'
    //     },
    //     {
    //       text: this.invoice.additionalDetails,
    //       margin: [0, 0 ,0, 15]
    //     },
    //     {
    //       columns: [
    //         [{ qr: `${this.invoice.customerName}`, fit: '50' }],
    //         [{ text: 'Signature', alignment: 'right', italics: true}],
    //       ]
    //     },
    //     {
    //       text: 'Terms and Conditions',
    //       style: 'sectionHeader'
    //     },
    //     {
    //       ul: [
    //         'Order can be return in max 10 days.',
    //         'Warrenty of the product will be subject to the manufacturer terms and conditions.',
    //         'This is system generated invoice.',
    //       ],
    //     }
    //   ],
    //   styles: {
    //     sectionHeader: {
    //       bold: true,
    //       decoration: 'underline',
    //       fontSize: 14,
    //       margin: [0, 15,0, 15]
    //     }
    //   }
    // };

    this.pdfObject = pdfMake.createPdf(definirDocumento);
    alert('pdf generado');
    this.abrirPdf();

  }

  abrirPdf(){
    this.pdfObject.getBuffer((buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      // Save the PDF to the data Directory of our App
      this.file.writeFile(this.file.dataDirectory, 'hello.pdf', blob, { replace: true }).then(fileEntry => {

        this.fileOpener.open(this.file.dataDirectory + 'hello.pdf', 'application/pdf');

      });

    });

    return true;
  }

}
