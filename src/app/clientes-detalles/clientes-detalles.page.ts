import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import {ActivatedRoute} from '@angular/router';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-clientes-detalles',
  templateUrl: './clientes-detalles.page.html',
  styleUrls: ['./clientes-detalles.page.scss'],
})
export class ClientesDetallesPage implements OnInit {

  idrecibido: string;
  cliente: any = null;
  paisCodigo = '595';
  cargando = true;

  // Datos calculados
  nombreDisplay = '';
  telefonoDisplay = '';
  ciDisplay = '';
  direccionDisplay = '';
  inicial = '';
  colorAvatar = 'primary';

  constructor(public database: DatabaseService,
              private activatedRoute: ActivatedRoute) {
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('ClientesDetallesPage - Constructor - ID recibido:', this.idrecibido);
  }

  ngOnInit() {
    console.log('ClientesDetallesPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('ClientesDetallesPage - ionViewWillEnter - Cargando datos para cliente ID:', this.idrecibido);
    this.cargando = true;
    this.cliente = null;
    this.getClienteDetalles();
  }

  async getClienteDetalles(){
    this.cargando = true;
    console.log('ClientesDetallesPage - getClienteDetalles - Consultando cliente:', this.idrecibido);

    try {
      const data = await this.database.getClienteDetalles(Number(this.idrecibido));
      console.log('ClientesDetallesPage - getClienteDetalles - Resultado:', data);

      if (data.values && data.values.length > 0) {
        this.cliente = { ...data.values[0] };
        this.precalcularDatos();
        console.log('ClientesDetallesPage - getClienteDetalles - Cliente cargado:', this.cliente);
      } else {
        console.log('ClientesDetallesPage - getClienteDetalles - No se encontró el cliente');
        this.cliente = null;
      }
    } catch (err) {
      console.error('ClientesDetallesPage - getClienteDetalles - Error:', err);
      this.cliente = null;
    } finally {
      this.cargando = false;
    }
  }

  precalcularDatos() {
    if (!this.cliente) return;

    // Precalcular nombre
    this.nombreDisplay = this.cliente.name || 'Sin nombre';

    // Precalcular teléfono
    this.telefonoDisplay = this.cliente.telefono
      ? `${this.paisCodigo} ${this.cliente.telefono}`
      : 'No registrado';

    // Precalcular CI
    this.ciDisplay = this.cliente.ci || 'No registrada';

    // Precalcular dirección
    this.direccionDisplay = this.cliente.direccion || 'No registrada';

    // Precalcular inicial
    this.inicial = this.nombreDisplay.charAt(0).toUpperCase();

    // Color aleatorio basado en ID
    const colores = ['primary', 'secondary', 'tertiary', 'success', 'warning'];
    this.colorAvatar = colores[this.cliente.id % colores.length];

    console.log('ClientesDetallesPage - precalcularDatos - Datos procesados');
  }

  getWhatsAppUrl(): string {
    if (!this.cliente?.telefono) return '';
    return `https://api.whatsapp.com/send?phone=${this.paisCodigo}${this.cliente.telefono}`;
  }

  tieneTelefono(): boolean {
    return !!(this.cliente?.telefono);
  }

  tieneCi(): boolean {
    return !!(this.cliente?.ci);
  }

  tieneDireccion(): boolean {
    return !!(this.cliente?.direccion && this.cliente.direccion.trim());
  }

  async tomarScreen() {
    try {
      console.log('tomarScreen - Iniciando captura de pantalla');

      const element = document.getElementById('printable-content');
      if (!element) {
        alert('No se encontró contenido para capturar');
        return;
      }

      console.log('tomarScreen - Elemento encontrado');
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f5f5f5',
        logging: false
      });

      console.log('tomarScreen - Canvas generado:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const base64 = imgData.split(',')[1];

      const fileName = `cliente_${Date.now()}.png`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache
      });

      console.log('tomarScreen - Archivo guardado:', savedFile.uri);

      await Share.share({
        title: 'Información del Cliente',
        url: savedFile.uri,
        dialogTitle: 'Compartir Imagen'
      });

      console.log('tomarScreen - Compartido exitosamente');
    } catch (error) {
      console.error('tomarScreen - Error:', error);
      console.error('tomarScreen - Stack:', (error as Error).stack);
      alert('Error al guardar la imagen: ' + ((error as Error).message || 'desconocido'));
    }
  }

  async generatePdf() {
    try {
      console.log('generatePdf - Iniciando generación de PDF');

      const element = document.getElementById('printable-content');
      if (!element) {
        alert('No se encontró contenido para generar PDF');
        return;
      }

      console.log('generatePdf - Elemento encontrado');
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f5f5f5',
        logging: false
      });

      console.log('generatePdf - Canvas generado:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      console.log('generatePdf - PDF creado');

      const pdfOutput = pdf.output('datauristring');
      const base64 = pdfOutput.split(',')[1];

      const fileName = `cliente_${Date.now()}.pdf`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache
      });

      console.log('generatePdf - Archivo guardado:', savedFile.uri);

      await Share.share({
        title: 'Información del Cliente',
        url: savedFile.uri,
        dialogTitle: 'Compartir PDF'
      });

      console.log('generatePdf - Compartido exitosamente');
    } catch (error) {
      console.error('generatePdf - Error:', error);
      console.error('generatePdf - Stack:', (error as Error).stack);
      alert('Error al generar el PDF: ' + ((error as Error).message || 'desconocido'));
    }
  }

}
