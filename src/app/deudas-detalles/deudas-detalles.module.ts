import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasDetallesPageRoutingModule } from './deudas-detalles-routing.module';

import { DeudasDetallesPage } from './deudas-detalles.page';
import {IonicSelectableModule} from 'ionic-selectable';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeudasDetallesPageRoutingModule,
        IonicSelectableModule
    ],
  declarations: [DeudasDetallesPage]
})
export class DeudasDetallesPageModule {}
