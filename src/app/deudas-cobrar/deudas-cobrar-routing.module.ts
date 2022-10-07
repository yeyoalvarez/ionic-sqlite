import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DeudasCobrarPage} from './deudas-cobrar.page';

const routes: Routes = [
  {
    path: '',
    component: DeudasCobrarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasCobrarPageRoutingModule {}
