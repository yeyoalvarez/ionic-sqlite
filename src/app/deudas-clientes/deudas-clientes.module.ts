import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasClientesPageRoutingModule } from './deudas-clientes-routing.module';

import { DeudasClientesPage } from './deudas-clientes.page';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DeudasClientesPageRoutingModule,
        Ng2SearchPipeModule,
        NgxPaginationModule
    ],
  declarations: [DeudasClientesPage]
})
export class DeudasClientesPageModule {}
