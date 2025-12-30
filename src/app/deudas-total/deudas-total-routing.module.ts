import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeudasTotalPage } from './deudas-total.page';

const routes: Routes = [
  {
    path: '',
    component: DeudasTotalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasTotalPageRoutingModule {}
