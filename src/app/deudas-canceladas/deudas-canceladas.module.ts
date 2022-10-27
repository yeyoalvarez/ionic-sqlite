import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasCanceladasPageRoutingModule } from './deudas-canceladas-routing.module';

import { DeudasCanceladasPage } from './deudas-canceladas.page';
import {Ng2SearchPipeModule} from "ng2-search-filter";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeudasCanceladasPageRoutingModule,
        Ng2SearchPipeModule
    ],
  declarations: [DeudasCanceladasPage]
})
export class DeudasCanceladasPageModule {}
