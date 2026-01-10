import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DatabaseService } from './database.service';

interface MenuCategory {
  title: string;
  pages: MenuPage[];
}

interface MenuPage {
  title: string;
  url: string;
  icon: string;
  badge?: number;
  badgeColor?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;

  public menuCategories: MenuCategory[] = [
    {
      title: 'Principal',
      pages: [
        { title: 'Inicio', url: '/inicio', icon: 'home' }
      ]
    },
    {
      title: 'Gestión',
      pages: [
        { title: 'Productos', url: '/productos', icon: 'pricetags' },
        { title: 'Clientes', url: '/clientes', icon: 'people-circle' },
        { title: 'Contactos', url: '/contactos', icon: 'call' }
      ]
    },
    {
      title: 'Deudas',
      pages: [
        { title: 'Clientes con Deudas', url: '/deudas-clientes', icon: 'wallet', badge: 0, badgeColor: 'primary' },
        { title: 'Por Cobrar Hoy', url: '/deudas-cobrar', icon: 'timer', badge: 0, badgeColor: 'warning' },
        { title: 'Canceladas', url: '/deudas-canceladas', icon: 'checkmark-circle', badgeColor: 'success' }
      ]
    },
    {
      title: 'Reportes',
      pages: [
        { title: 'Resumen Total', url: '/deudas-total', icon: 'analytics' }
      ]
    }
  ];

  constructor(
    private platform: Platform,
    private database: DatabaseService
  ) {
    this.initializarApp();
  }

  async initializarApp() {
    await this.platform.ready();
    console.log('=== APP INICIALIZADA ===');

    try {
      // Inicializar la base de datos
      console.log('Iniciando creación de base de datos...');
      await this.database.createDatabase();
      console.log('✅ Base de datos inicializada correctamente');
      console.log('Estado BD Ready:', this.database.dbReady);

      // Cargar contadores del menú
      this.cargarContadoresMenu();
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
      console.error('Detalles:', JSON.stringify(error));
    }
  }

  async cargarContadoresMenu() {
    try {
      // Contador de deudas activas
      const deudasActivas = await this.database.getDeudas();
      const totalDeudas = deudasActivas?.values?.length || 0;

      // Contador de deudas por cobrar hoy
      const deudasCobrar = await this.database.getDeudas();
      let porCobrar = 0;
      if (deudasCobrar?.values) {
        porCobrar = deudasCobrar.values.filter((d: any) => d.debeRecordar).length;
      }

      // Actualizar badges
      this.menuCategories.forEach(category => {
        category.pages.forEach(page => {
          if (page.url === '/deudas-clientes') {
            page.badge = totalDeudas;
          } else if (page.url === '/deudas-cobrar') {
            page.badge = porCobrar;
          }
        });
      });
    } catch (error) {
      console.error('Error cargando contadores del menú:', error);
    }
  }

  ionViewWillEnter() {
    this.cargarContadoresMenu();
  }
}
