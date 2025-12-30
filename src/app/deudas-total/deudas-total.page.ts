import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { PDFGenerator, PDFGeneratorOptions } from '@awesome-cordova-plugins/pdf-generator/ngx';

@Component({
  selector: 'app-deudas-total',
  templateUrl: './deudas-total.page.html',
  styleUrls: ['./deudas-total.page.scss'],
})
export class DeudasTotalPage implements OnInit {

  totalClientes = 0;
  totalDeudas = 0;
  html: any;

  constructor(
    private database: DatabaseService,
    private pdf: PDFGenerator
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getDeudaTotalData();
  }

  // Método principal para obtener los totales
  async getDeudaTotalData() {
    try {
      // Abrir la base de datos si no está abierta
      await this.database.openDatabase();

      // Ejecutar consulta de totales
      const data = await this.database.getDeudaTotal();
      if (data.rows.length > 0) {
        const row = data.rows.item(0);
        this.totalClientes = row.total_clientes_con_deuda;
        this.totalDeudas = row.total_deudas || 0;

        console.log('Clientes con deuda:', this.totalClientes);
        console.log('Monto total adeudado:', this.totalDeudas);
      }
    } catch (error) {
      console.error('Error al obtener deudas totales:', error);
    }
  }

  // Formatear números con separador de miles
  moneda(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Generar PDF desde el contenido del HTML
  generatePdf() {
    const options: PDFGeneratorOptions = {
      type: 'share'
    };

    this.html = document.getElementById('content')?.innerHTML;
    if (this.html) {
      this.pdf.fromData(this.html, options);
    } else {
      console.warn('No se encontró contenido para generar el PDF.');
    }
  }
}
