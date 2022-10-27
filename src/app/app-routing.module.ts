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
    path: 'clientes-detalles',
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











];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
