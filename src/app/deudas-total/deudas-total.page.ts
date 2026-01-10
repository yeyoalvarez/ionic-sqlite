import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-deudas-total',
  templateUrl: './deudas-total.page.html',
  styleUrls: ['./deudas-total.page.scss'],
})
export class DeudasTotalPage implements OnInit {
  // Variables de control
  cargando = true;

  // Datos principales
  totalClientes = 0;
  totalDeudas = 0;

  // Datos calculados
  promedioPorCliente = 0;
  totalClientesDisplay = '0';
  totalDeudasDisplay = '0 Gs';
  promedioPorClienteDisplay = '0 Gs';

  constructor(
    private database: DatabaseService
  ) {}

  ngOnInit() {
    console.log('DeudasTotalPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('DeudasTotalPage - ionViewWillEnter - Cargando totales');
    this.getDeudaTotalData();
  }

  // Método principal para obtener los totales
  async getDeudaTotalData() {
    this.cargando = true;
    console.log('DeudasTotalPage - getDeudaTotalData - Consultando');

    try {
      // Abrir la base de datos si no está abierta
      await this.database.openDatabase();

      // Ejecutar consulta de totales
      const data = await this.database.getDeudaTotal();
      console.log('DeudasTotalPage - getDeudaTotalData - Resultado:', data);

      if (data.values.length > 0) {
        const row = data.values[0];
        this.totalClientes = row.total_clientes_con_deuda || 0;
        this.totalDeudas = row.total_deudas || 0;

        // Calcular promedio por cliente
        if (this.totalClientes > 0) {
          this.promedioPorCliente = Math.round(this.totalDeudas / this.totalClientes);
        } else {
          this.promedioPorCliente = 0;
        }

        this.precalcularDatos();

        console.log('DeudasTotalPage - getDeudaTotalData - Clientes:', this.totalClientes);
        console.log('DeudasTotalPage - getDeudaTotalData - Total:', this.totalDeudas);
        console.log('DeudasTotalPage - getDeudaTotalData - Promedio:', this.promedioPorCliente);
      }
    } catch (error) {
      console.error('DeudasTotalPage - getDeudaTotalData - Error:', error);
    } finally {
      this.cargando = false;
    }
  }

  precalcularDatos() {
    this.totalClientesDisplay = this.totalClientes.toString();
    this.totalDeudasDisplay = `${this.moneda(this.totalDeudas)} Gs`;
    this.promedioPorClienteDisplay = `${this.moneda(this.promedioPorCliente)} Gs`;

    console.log('DeudasTotalPage - precalcularDatos - Datos formateados');
  }

  // Formatear números con separador de miles
  moneda(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Generar PDF desde el contenido del HTML
  async generatePdf() {
    try {
      const element = document.getElementById('content');
      if (!element) {
        alert('No se encontró el contenido');
        return;
      }

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 105; // A6 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const pdfOutput = pdf.output('datauristring');
      const base64 = pdfOutput.split(',')[1];

      const fileName = `deudas_total_${Date.now()}.pdf`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache
      });

      await Share.share({
        title: 'Reporte de Deudas Total',
        url: savedFile.uri,
        dialogTitle: 'Compartir PDF'
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF');
    }
  }
}
