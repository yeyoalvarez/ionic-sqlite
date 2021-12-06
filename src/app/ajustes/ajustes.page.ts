import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Contact, Contacts} from '@capacitor-community/contacts';
import {AlertController, ToastController} from '@ionic/angular';
import {DatabaseService} from '../database.service';

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
    public alertCtrl: AlertController
  ) {
    this.database.createDatabase().then(() => {
    });
  }

  ngOnInit() {
   // this.permisoImportar = false;
  }

  async getPermissions(): Promise<void> {
    console.log('button clicked');
    Contacts.getPermissions();
    this.getContacts();
  }

  async getContacts(): Promise<void> {
    console.log('tesbutton clicked');
    Contacts.getContacts().then(result => {
      console.log('result is:' , result);
      const phoneContacts: Contact[] = result.contacts;
      this.contacts = of(phoneContacts);
    });
  }

  async insertarContactos(nombre: string, telefono: string){
    if (Number(telefono.substr(-8,8)) <= 99999999) {
      console.log('Es numero valido');
      this.database.importarClientes(nombre, Number(telefono.substr(-8,8)) ).then((data) => {
        alert(data);
      });
    //  this.permisoImportar = false;
    } else{
      console.log('No valido');
    }
  }

  async alerta(){
    const alert = await  this.alertCtrl.create({
      header:'Alert',
      message: 'Contactos Copiados',
      buttons: ['OK']
    });
    await alert.present();
  }

  async permiso(){
    this.permisoImportar = true;
  }

}
