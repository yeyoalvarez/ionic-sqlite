import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarDeudasPageRoutingModule } from './editar-deudas-routing.module';

import { EditarDeudasPage } from './editar-deudas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarDeudasPageRoutingModule
  ],
  declarations: [EditarDeudasPage]
})
export class EditarDeudasPageModule {}
