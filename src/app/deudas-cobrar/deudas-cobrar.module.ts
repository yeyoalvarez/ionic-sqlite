import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DeudasCobrarPageRoutingModule} from './deudas-cobrar-routing.module';

import {DeudasCobrarPage} from './deudas-cobrar.page';
import { FilterPipe } from '../pipes/filter.pipe';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeudasCobrarPageRoutingModule,
        FilterPipe,
        NgxPaginationModule
    ],
  declarations: [DeudasCobrarPage]
})
export class DeudasCobrarPageModule {}
