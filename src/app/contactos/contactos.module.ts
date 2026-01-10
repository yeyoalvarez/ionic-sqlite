import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxPaginationModule } from 'ngx-pagination';

import { ContactosPageRoutingModule } from './contactos-routing.module';

import { ContactosPage } from './contactos.page';
import { FilterPipe } from '../pipes/filter.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ContactosPageRoutingModule,
        NgxPaginationModule,
        FilterPipe
    ],
  declarations: [ContactosPage]
})
export class ContactosPageModule {}
