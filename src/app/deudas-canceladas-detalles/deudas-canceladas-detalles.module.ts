import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasCanceladasDetallesPageRoutingModule } from './deudas-canceladas-detalles-routing.module';

import { DeudasCanceladasDetallesPage } from './deudas-canceladas-detalles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeudasCanceladasDetallesPageRoutingModule
  ],
  declarations: [DeudasCanceladasDetallesPage]
})
export class DeudasCanceladasDetallesPageModule {}
