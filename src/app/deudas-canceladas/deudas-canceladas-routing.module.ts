import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeudasCanceladasPage } from './deudas-canceladas.page';

const routes: Routes = [
  {
    path: '',
    component: DeudasCanceladasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasCanceladasPageRoutingModule {}
