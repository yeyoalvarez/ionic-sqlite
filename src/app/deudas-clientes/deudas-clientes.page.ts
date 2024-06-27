import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-deudas-clientes',
  templateUrl: './deudas-clientes.page.html',
  styleUrls: ['./deudas-clientes.page.scss'],
})
export class DeudasClientesPage implements OnInit {

  idrecibido: string;
  deudas: any[] = [];
  textoBuscar = '';
  p = 1; // Variable de paginación

  constructor(
    private database: DatabaseService,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController
  ) {
    this.database.createDatabase().then(() => {
      this.idrecibido = this.activatedRoute.snapshot.paramMap.get('id');
      this.getDeudas();
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getDeudas();
  }

  moneda(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  getDeudas() {
    this.database.getDeudas().then((data) => {
      this.deudas = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.deudas.push(data.rows.item(i));
      }
    });
  }

  async deleteDeudas(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres eliminar esta deuda?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.database.deleteDeudas(id).then(() => {
              this.getDeudas();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
