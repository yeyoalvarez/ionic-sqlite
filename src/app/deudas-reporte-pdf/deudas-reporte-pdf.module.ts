import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasReportePdfPageRoutingModule } from './deudas-reporte-pdf-routing.module';

import { DeudasReportePdfPage } from './deudas-reporte-pdf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeudasReportePdfPageRoutingModule
  ],
  declarations: [DeudasReportePdfPage]
})
export class DeudasReportePdfPageModule {}
