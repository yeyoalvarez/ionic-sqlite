import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasTotalPageRoutingModule } from './deudas-total-routing.module';

import { DeudasTotalPage } from './deudas-total.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeudasTotalPageRoutingModule
  ],
  declarations: [DeudasTotalPage]
})
export class DeudasTotalPageModule {}
