import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarDeudasPage } from './editar-deudas.page';

const routes: Routes = [
  {
    path: '',
    component: EditarDeudasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarDeudasPageRoutingModule {}
