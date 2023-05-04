import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeudasCanceladasDetallesPage } from './deudas-canceladas-detalles.page';

const routes: Routes = [
  {
    path: '',
    component: DeudasCanceladasDetallesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasCanceladasDetallesPageRoutingModule {}
