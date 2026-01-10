import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  // Estadísticas del dashboard
  totalDeudasActivas = 0;
  totalDeudasPorCobrar = 0;
  totalDeudasCanceladas = 0;
  montoTotalAdeudado = 0;
  totalClientes = 0;
  totalProductos = 0;

  // Próximas deudas a cobrar
  proximasDeudas: any[] = [];

  // Loading
  cargando = true;

  constructor(
    private database: DatabaseService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('InicioPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('InicioPage - ionViewWillEnter');
    this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    try {
      this.cargando = true;

      // Cargar deudas activas
      const deudasActivas = await this.database.getDeudas();
      if (deudasActivas?.values) {
        this.totalDeudasActivas = deudasActivas.values.length;

        // Calcular monto total adeudado
        this.montoTotalAdeudado = deudasActivas.values.reduce((sum: number, deuda: any) => {
          return sum + (deuda.monto || 0);
        }, 0);

        // Filtrar deudas por cobrar
        this.totalDeudasPorCobrar = deudasActivas.values.filter((d: any) => d.debeRecordar).length;

        // Obtener las 5 próximas deudas a cobrar ordenadas por monto (mayor a menor)
        this.proximasDeudas = deudasActivas.values
          .filter((d: any) => d.debeRecordar)
          .sort((a: any, b: any) => b.monto - a.monto)
          .slice(0, 5);
      }

      // Cargar deudas canceladas
      const deudasCanceladas = await this.database.getDeudasCanceladas();
      if (deudasCanceladas?.values) {
        this.totalDeudasCanceladas = deudasCanceladas.values.length;
      }

      // Cargar total de clientes
      const clientes = await this.database.getClientes();
      if (clientes?.values) {
        this.totalClientes = clientes.values.length;
      }

      // Cargar total de productos
      const productos = await this.database.getProductos();
      if (productos?.values) {
        this.totalProductos = productos.values.length;
      }

      console.log('Estadísticas cargadas:', {
        deudasActivas: this.totalDeudasActivas,
        porCobrar: this.totalDeudasPorCobrar,
        canceladas: this.totalDeudasCanceladas,
        montoTotal: this.montoTotalAdeudado
      });

    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      this.cargando = false;
    }
  }

  moneda(x: number): string {
    if (!x) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  navegarADeuda(idDeuda: number) {
    this.router.navigate(['/deudas-detalles', idDeuda]);
  }

  doRefresh(event: any) {
    console.log('Refrescando dashboard...');
    this.cargarEstadisticas().then(() => {
      event.target.complete();
    });
  }
}

