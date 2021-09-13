import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeudasActivasPage } from './deudas-activas.page';

const routes: Routes = [
  {
    path: '',
    component: DeudasActivasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasActivasPageRoutingModule {}
