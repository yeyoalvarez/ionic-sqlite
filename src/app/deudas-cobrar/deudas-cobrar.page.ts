import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import * as moment from 'moment';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deudas-cobrar',
  templateUrl: './deudas-cobrar.page.html',
  styleUrls: ['./deudas-cobrar.page.scss'],
})
export class DeudasCobrarPage implements OnInit {
  textoBuscar = '';
  deudas: any = [];
  deudasFiltradas: any = [];
  p = 1; // Variable de paginación
  cargando = true;

  // Filtros
  filtroUrgencia: 'todas' | 'vencidas' | 'hoy' | 'proximas' = 'todas';
  ordenamiento: 'urgencia' | 'monto-desc' | 'nombre-asc' = 'urgencia';

  constructor(
    public database: DatabaseService,
    public loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('DeudasCobrarPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('DeudasCobrarPage - ionViewWillEnter - Cargando deudas');
    this.getDeudas();
  }

  getDeudas() {
    this.cargando = true;
    console.log('DeudasCobrarPage - getDeudas - Consultando base de datos');
    this.database.getDeudas().then((data) => {
      this.deudas = [];
      if (data?.values && data.values.length > 0) {
        console.log('DeudasCobrarPage - getDeudas - Total deudas:', data.values.length);

        for (let i = 0; i < data.values.length; i++) {
          const deuda = { ...data.values[i] };

          // Precalcular si debe recordarse esta deuda
          deuda.debeRecordar = this.calcularDebeRecordar(deuda.fecha, deuda.recordatorio);

          // Calcular días de retraso
          if (deuda.debeRecordar) {
            deuda.diasRetraso = this.calcularDiasRetraso(deuda.fecha, deuda.recordatorio);
            deuda.urgencia = this.calcularUrgencia(deuda.diasRetraso);
          }

          this.deudas.push(deuda);
        }

        const deudasARecordar = this.deudas.filter(d => d.debeRecordar).length;
        console.log('DeudasCobrarPage - Deudas a recordar:', deudasARecordar);
      } else {
        console.log('DeudasCobrarPage - No hay deudas');
      }

      this.aplicarFiltrosYOrdenamiento();
      this.cargando = false;
    }).catch(err => {
      console.error('DeudasCobrarPage - Error al cargar deudas:', err);
      this.cargando = false;
    });
  }

  aplicarFiltrosYOrdenamiento() {
    // Filtrar solo las deudas que deben recordarse
    let resultado = this.deudas.filter(d => d.debeRecordar);

    // Aplicar filtro de búsqueda
    if (this.textoBuscar.trim()) {
      const busqueda = this.textoBuscar.toLowerCase();
      resultado = resultado.filter(d =>
        d.clientes?.toLowerCase().includes(busqueda) ||
        d.productos?.toLowerCase().includes(busqueda)
      );
    }

    // Aplicar filtro de urgencia
    if (this.filtroUrgencia === 'vencidas') {
      resultado = resultado.filter(d => d.diasRetraso > 7);
    } else if (this.filtroUrgencia === 'hoy') {
      resultado = resultado.filter(d => d.diasRetraso >= 0 && d.diasRetraso <= 7);
    } else if (this.filtroUrgencia === 'proximas') {
      resultado = resultado.filter(d => d.diasRetraso < 0);
    }

    // Aplicar ordenamiento
    resultado.sort((a, b) => {
      switch (this.ordenamiento) {
        case 'urgencia':
          return b.diasRetraso - a.diasRetraso; // Mayor retraso primero
        case 'monto-desc':
          return b.monto - a.monto;
        case 'nombre-asc':
          return a.clientes?.localeCompare(b.clientes);
        default:
          return 0;
      }
    });

    this.deudasFiltradas = resultado;
  }

  onBuscarChange() {
    this.aplicarFiltrosYOrdenamiento();
  }

  cambiarOrdenamiento(tipo: 'urgencia' | 'monto-desc' | 'nombre-asc') {
    this.ordenamiento = tipo;
    this.aplicarFiltrosYOrdenamiento();
  }

  cambiarFiltroUrgencia(tipo: 'todas' | 'vencidas' | 'hoy' | 'proximas') {
    this.filtroUrgencia = tipo;
    this.aplicarFiltrosYOrdenamiento();
  }

  calcularDebeRecordar(fec: any, tiempo: string): boolean {
    if (!fec || fec === 0 || fec === '0' || fec.toString().trim() === '') {
      return false;
    }

    if (!tiempo || (tiempo !== 'Semanal' && tiempo !== 'Mensual')) {
      return false;
    }

    const fechaUltimoCobro = moment(fec, 'DD/MM/YYYY', true);

    if (!fechaUltimoCobro.isValid()) {
      return false;
    }

    const hoy = moment();
    const diasTranscurridos = hoy.diff(fechaUltimoCobro, 'days');

    if (tiempo === 'Semanal') {
      return diasTranscurridos >= 7;
    } else if (tiempo === 'Mensual') {
      return diasTranscurridos >= 30;
    }

    return false;
  }

  calcularDiasRetraso(fec: any, tiempo: string): number {
    const fechaUltimoCobro = moment(fec, 'DD/MM/YYYY', true);
    const hoy = moment();
    const diasTranscurridos = hoy.diff(fechaUltimoCobro, 'days');

    const limiteRecordatorio = tiempo === 'Semanal' ? 7 : 30;
    return diasTranscurridos - limiteRecordatorio;
  }

  calcularUrgencia(diasRetraso: number): 'alta' | 'media' | 'baja' {
    if (diasRetraso > 7) return 'alta';
    if (diasRetraso >= 0) return 'media';
    return 'baja';
  }

  getColorUrgencia(urgencia: string): string {
    if (urgencia === 'alta') return 'danger';
    if (urgencia === 'media') return 'warning';
    return 'success';
  }

  getIconoUrgencia(urgencia: string): string {
    if (urgencia === 'alta') return 'alert-circle';
    if (urgencia === 'media') return 'warning';
    return 'time';
  }

  getTextoUrgencia(diasRetraso: number, recordatorio: string): string {
    if (diasRetraso > 7) {
      return `Vencido hace ${diasRetraso} días`;
    } else if (diasRetraso >= 0) {
      return `Vencido hace ${diasRetraso} días`;
    } else {
      return `Próximo cobro`;
    }
  }

  getColorPorMonto(monto: number): string {
    if (monto >= 500000) return 'danger';
    if (monto >= 100000) return 'warning';
    return 'primary';
  }

  getInicialCliente(nombre: string): string {
    return nombre?.charAt(0).toUpperCase() || '?';
  }

  moneda(x: number): string {
    if (!x) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  calcularMontoTotal(): number {
    if (!this.deudasFiltradas || this.deudasFiltradas.length === 0) {
      return 0;
    }
    return this.deudasFiltradas.reduce((sum, d) => sum + (d.monto || 0), 0);
  }

  navegarADetalle(id: number) {
    this.router.navigate(['/deudas-detalles', id]);
  }

  doRefresh(event: any) {
    console.log('Refrescando deudas por cobrar...');
    this.getDeudas();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
