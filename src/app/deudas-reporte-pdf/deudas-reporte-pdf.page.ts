import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  constructor(
    public database: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {
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
      if (data.values && data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.deudas.push(data.values[i]);
        }
      }
    });
  }

  async generatePdf() {
    try {
      console.log('generatePdf - Iniciando generación de PDF');

      const element = document.querySelector('ion-content');
      if (!element) {
        console.error('generatePdf - No se encontró ion-content');
        alert('No se encontró el contenido');
        return;
      }

      console.log('generatePdf - Elemento encontrado, generando canvas...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      console.log('generatePdf - Canvas generado:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      console.log('generatePdf - PDF creado');

      const pdfOutput = pdf.output('datauristring');
      const base64 = pdfOutput.split(',')[1];

      const fileName = `reporte-deudas-${new Date().getTime()}.pdf`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache
      });

      console.log('generatePdf - Archivo guardado:', savedFile.uri);

      await Share.share({
        title: 'Reporte de Deudas',
        text: 'Reporte de deudas generado',
        url: savedFile.uri,
        dialogTitle: 'Compartir PDF'
      });

      console.log('generatePdf - Compartido exitosamente');
    } catch (error) {
      console.error('generatePdf - Error:', error);
      console.error('generatePdf - Error stack:', (error as Error).stack);
      alert('Error al generar PDF: ' + ((error as Error).message || error));
    }
  }

  async tomarScreen() {
    try {
      console.log('tomarScreen - Iniciando captura de pantalla');

      const element = document.querySelector('ion-content');
      if (!element) {
        console.error('tomarScreen - No se encontró ion-content');
        alert('No se encontró el contenido');
        return;
      }

      console.log('tomarScreen - Elemento encontrado, generando canvas...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      console.log('tomarScreen - Canvas generado:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const base64 = imgData.split(',')[1];

      const fileName = `screenshot-${new Date().getTime()}.png`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache
      });

      console.log('tomarScreen - Archivo guardado:', savedFile.uri);

      await Share.share({
        title: 'Captura de Pantalla',
        url: savedFile.uri,
        dialogTitle: 'Compartir Imagen'
      });

      console.log('tomarScreen - Compartido exitosamente');
    } catch (error) {
      console.error('tomarScreen - Error:', error);
      console.error('tomarScreen - Error stack:', (error as Error).stack);
      alert('Error al tomar screenshot: ' + ((error as Error).message || error));
    }
  }
}
