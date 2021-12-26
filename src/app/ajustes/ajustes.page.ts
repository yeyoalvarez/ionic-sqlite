import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Contact, Contacts} from '@capacitor-community/contacts';
import {AlertController, ToastController} from '@ionic/angular';
import {DatabaseService} from '../database.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  // export interface PhoneContact {
//   contactId: string;
//   lookupKey: string;
//   displayName: string;
//   phoneNumbers: [string];
//   emails: [string];
// }

  textoBuscar = '';
  permisoImportar: boolean;
  contacts: Observable<Contact[]>;

  constructor(public database: DatabaseService,
              public alertCtrl: AlertController,
              public loadingController: LoadingController

  ) {
    this.database.createDatabase().then(() => {
    });
  }

  ngOnInit() {
  }

  async getPermissions(): Promise<void> {
    console.log('button clicked');
    Contacts.getPermissions();
  }

  async getContacts(): Promise<void> {
    Contacts.getContacts().then(result => {
      console.log('result is:' , result);
      const phoneContacts: Contact[] = result.contacts;
      this.contacts = of(phoneContacts);
    });
  }

  async insertarContactos(nombre: string, telefono: string){
    const telefonoParsed = telefono.replace(" ", "");
    console.log(`parsing ${telefono} => ${telefonoParsed}`);
    if (Number(telefonoParsed.substr(-8,8)) <= 99999999) {
      console.log('Es numero valido');
      this.database.importarClientes(nombre, Number(telefonoParsed.substr(-8,8)) ).then((data) => {
      });
    } else{
      console.log('No es valido el numero');
    }
  }

  async pantallaEspera(mensaje: string) {
    const loading = await this.loadingController.create({
      message: mensaje,
      duration: 3000
    });
    return await loading.present();
  }

  async permiso(){
    this.permisoImportar = true;
  }

}
