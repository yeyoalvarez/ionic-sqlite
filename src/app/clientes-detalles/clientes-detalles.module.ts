import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesDetallesPageRoutingModule } from './clientes-detalles-routing.module';

import { ClientesDetallesPage } from './clientes-detalles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientesDetallesPageRoutingModule
  ],
  declarations: [ClientesDetallesPage]
})
export class ClientesDetallesPageModule {}
