import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasPageRoutingModule } from './deudas-routing.module';

import { DeudasPage } from './deudas.page';
import  {IonicSelectableComponent} from 'ionic-selectable';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeudasPageRoutingModule,
        IonicSelectableComponent
    ],
  declarations: [DeudasPage]
})
export class DeudasPageModule {}
