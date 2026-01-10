import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { ClientesPage } from './clientes.page';
import { FilterPipe } from '../pipes/filter.pipe';
import {NgxPaginationModule} from 'ngx-pagination';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    FilterPipe,
    NgxPaginationModule
  ],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
