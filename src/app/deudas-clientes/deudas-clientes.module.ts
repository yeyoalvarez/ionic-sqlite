import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasClientesPageRoutingModule } from './deudas-clientes-routing.module';

import { DeudasClientesPage } from './deudas-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeudasClientesPageRoutingModule
  ],
  declarations: [DeudasClientesPage]
})
export class DeudasClientesPageModule {}
