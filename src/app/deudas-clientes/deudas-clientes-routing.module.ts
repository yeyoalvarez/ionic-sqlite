import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeudasClientesPage } from './deudas-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: DeudasClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasClientesPageRoutingModule {}
