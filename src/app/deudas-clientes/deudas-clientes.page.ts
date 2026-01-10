import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-deudas-clientes',
  templateUrl: './deudas-clientes.page.html',
  styleUrls: ['./deudas-clientes.page.scss'],
})
export class DeudasClientesPage implements OnInit {

  idrecibido: string;
  deudas: any[] = [];
  deudasFiltradas: any[] = [];
  textoBuscar = '';
  p = 1; // Variable de paginación
  cargando = true;

  // Filtros
  filtroMonto: 'todos' | 'menor' | 'mayor' = 'todos';
  ordenamiento: 'monto-desc' | 'monto-asc' | 'nombre-asc' | 'fecha-desc' = 'monto-desc';

  constructor(
    private database: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public alertController: AlertController
  ) {
    this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getDeudas();
  }

  moneda(x: number) {
    if (!x) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  calcularMontoTotal(): number {
    if (!this.deudasFiltradas || this.deudasFiltradas.length === 0) {
      return 0;
    }
    return this.deudasFiltradas.reduce((sum, d) => sum + (d.monto || 0), 0);
  }

  getDeudas() {
    this.cargando = true;
    this.database.getDeudas().then((data) => {
      this.deudas = [];
      if (data?.values) {
        for (let i = 0; i < data.values.length; i++) {
          this.deudas.push(data.values[i]);
        }
      }
      this.aplicarFiltrosYOrdenamiento();
      this.cargando = false;
    }).catch(err => {
      console.error('Error cargando deudas:', err);
      this.cargando = false;
    });
  }

  aplicarFiltrosYOrdenamiento() {
    let resultado = [...this.deudas];

    // Aplicar filtro de búsqueda
    if (this.textoBuscar.trim()) {
      const busqueda = this.textoBuscar.toLowerCase();
      resultado = resultado.filter(d =>
        d.clientes?.toLowerCase().includes(busqueda) ||
        d.productos?.toLowerCase().includes(busqueda)
      );
    }

    // Aplicar filtro de monto
    if (this.filtroMonto === 'menor') {
      resultado = resultado.filter(d => d.monto < 100000);
    } else if (this.filtroMonto === 'mayor') {
      resultado = resultado.filter(d => d.monto >= 100000);
    }

    // Aplicar ordenamiento
    resultado.sort((a, b) => {
      switch (this.ordenamiento) {
        case 'monto-desc':
          return b.monto - a.monto;
        case 'monto-asc':
          return a.monto - b.monto;
        case 'nombre-asc':
          return a.clientes?.localeCompare(b.clientes);
        case 'fecha-desc':
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        default:
          return 0;
      }
    });

    this.deudasFiltradas = resultado;
  }

  onBuscarChange() {
    this.aplicarFiltrosYOrdenamiento();
  }

  cambiarOrdenamiento(tipo: 'monto-desc' | 'monto-asc' | 'nombre-asc' | 'fecha-desc') {
    this.ordenamiento = tipo;
    this.aplicarFiltrosYOrdenamiento();
  }

  cambiarFiltroMonto(tipo: 'todos' | 'menor' | 'mayor') {
    this.filtroMonto = tipo;
    this.aplicarFiltrosYOrdenamiento();
  }

  getColorPorMonto(monto: number): string {
    if (monto >= 500000) return 'danger';
    if (monto >= 100000) return 'warning';
    return 'primary';
  }

  getUrgenciaIcono(recordatorio: string): string {
    if (recordatorio === 'Semanal') return 'alert-circle';
    if (recordatorio === 'Mensual') return 'time';
    return 'calendar';
  }

  getColorRecordatorio(recordatorio: string): string {
    if (recordatorio === 'Semanal') return 'danger';
    if (recordatorio === 'Mensual') return 'warning';
    return 'medium';
  }

  getInicialCliente(nombre: string): string {
    return nombre?.charAt(0).toUpperCase() || '?';
  }

  navegarADetalle(id: number) {
    this.router.navigate(['/deudas-detalles', id]);
  }

  async deleteDeudas(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres eliminar esta deuda?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        }, {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.database.deleteDeudas(id).then(() => {
              this.getDeudas();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  doRefresh(event: any) {
    console.log('Refrescando deudas...');
    this.getDeudas();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
