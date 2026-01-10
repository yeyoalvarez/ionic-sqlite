import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deudas-canceladas',
  templateUrl: './deudas-canceladas.page.html',
  styleUrls: ['./deudas-canceladas.page.scss'],
})
export class DeudasCanceladasPage implements OnInit {
  // Variables de control
  cargando = true;

  // Datos principales
  deudas: any = [];

  // Búsqueda y paginación
  textoBuscar = '';
  p = 1;

  constructor(
    public database: DatabaseService,
    private activatedRoute: ActivatedRoute
  ) {
    this.database.createDatabase().then(() => {
      this.getDeudasCanceladas();
    });
  }

  ngOnInit() {
    console.log('DeudasCanceladasPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('DeudasCanceladasPage - ionViewWillEnter - Cargando deudas canceladas');
    this.getDeudasCanceladas();
  }

  getDeudasCanceladas() {
    this.cargando = true;
    console.log('DeudasCanceladasPage - getDeudasCanceladas - Consultando');

    this.database.getDeudasCanceladas().then((data) => {
      this.deudas = [];
      console.log('DeudasCanceladasPage - getDeudasCanceladas - Resultado:', data);

      if (data.values && data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          const deuda: any = { ...data.values[i] };

          // Precalcular datos
          deuda.nombreDisplay = deuda.clientes || 'Sin nombre';
          deuda.inicial = deuda.nombreDisplay.charAt(0).toUpperCase();
          deuda.fechaDisplay = deuda.fecha || 'Sin fecha';
          deuda.textoBusqueda = `${deuda.nombreDisplay} ${deuda.productos || ''} ${deuda.fecha || ''}`.toLowerCase();

          // Color aleatorio para avatar basado en ID
          const colores = ['success', 'primary', 'secondary', 'tertiary', 'medium'];
          deuda.colorAvatar = colores[deuda.id % colores.length];

          this.deudas.push(deuda);
        }

        console.log('DeudasCanceladasPage - getDeudasCanceladas - Total:', this.deudas.length);
      } else {
        console.log('DeudasCanceladasPage - getDeudasCanceladas - No hay deudas canceladas');
      }

      this.cargando = false;
    }).catch(err => {
      console.error('DeudasCanceladasPage - getDeudasCanceladas - Error:', err);
      this.cargando = false;
    });
  }

  buscarTexto(deuda: any): boolean {
    if (!this.textoBuscar || this.textoBuscar.trim() === '') {
      return true;
    }
    const busqueda = this.textoBuscar.toLowerCase();
    return deuda.textoBusqueda.includes(busqueda);
  }

  moneda(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
