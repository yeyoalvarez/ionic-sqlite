import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasActivasPageRoutingModule } from './deudas-activas-routing.module';

import { DeudasActivasPage } from './deudas-activas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeudasActivasPageRoutingModule
  ],
  declarations: [DeudasActivasPage]
})
export class DeudasActivasPageModule {}
