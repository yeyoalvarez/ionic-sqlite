import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeudasReportePdfPage } from './deudas-reporte-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: DeudasReportePdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeudasReportePdfPageRoutingModule {}
