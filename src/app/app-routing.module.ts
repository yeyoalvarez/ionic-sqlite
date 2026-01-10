import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'deudas',
    loadChildren: () => import('./deudas/deudas.module').then( m => m.DeudasPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'deudas-detalles/:id',
    loadChildren: () => import('./deudas-detalles/deudas-detalles.module').then( m => m.DeudasDetallesPageModule)
  },
  {
    path: 'contactos',
    loadChildren: () => import('./contactos/contactos.module').then( m => m.ContactosPageModule)
  },
  {
    path: 'deudas-clientes',
    loadChildren: () => import('./deudas-clientes/deudas-clientes.module').then( m => m.DeudasClientesPageModule)
  },
  {
    path: 'clientes-detalles/:id',
    loadChildren: () => import('./clientes-detalles/clientes-detalles.module').then( m => m.ClientesDetallesPageModule)
  },
  {
    path: 'deudas-cobrar',
    loadChildren: () => import('./deudas-cobrar/deudas-cobrar.module').then( m => m.DeudasCobrarPageModule)
  },
  {
    path: 'deudas-canceladas',
    loadChildren: () => import('./deudas-canceladas/deudas-canceladas.module').then( m => m.DeudasCanceladasPageModule)
  },
  {
    path: 'deudas-canceladas-detalles/:id',
    // eslint-disable-next-line max-len
    loadChildren: () => import('./deudas-canceladas-detalles/deudas-canceladas-detalles.module').then( m => m.DeudasCanceladasDetallesPageModule)
  },
  {
    path: 'deudas-reporte-pdf/:id',
    loadChildren: () => import('./deudas-reporte-pdf/deudas-reporte-pdf.module').then( m => m.DeudasReportePdfPageModule)
  },  {
    path: 'deudas-total',
    loadChildren: () => import('./deudas-total/deudas-total.module').then( m => m.DeudasTotalPageModule)
  },
  {
    path: 'backup-bd',
    loadChildren: () => import('./backup-bd/backup-bd.module').then( m => m.BackupBdPageModule)
  },














];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
