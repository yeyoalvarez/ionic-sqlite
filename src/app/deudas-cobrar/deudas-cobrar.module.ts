import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DeudasCobrarPageRoutingModule} from './deudas-cobrar-routing.module';

import {DeudasCobrarPage} from './deudas-cobrar.page';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeudasCobrarPageRoutingModule,
        Ng2SearchPipeModule,
        NgxPaginationModule
    ],
  declarations: [DeudasCobrarPage]
})
export class DeudasCobrarPageModule {}
