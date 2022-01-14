import { Component, OnInit } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import {DatabaseService} from '../database.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {

  textoBuscar = '';
  telefonoParsed = '';
  contacts: any = [];

  constructor(public database: DatabaseService,
              public alertController: AlertController) {
    this.getPermissions();
    this.database.createDatabase().then(() => {
    }); }

  ngOnInit() {
  }

  async getPermissions() {
    const permisos = await Contacts.getPermissions();
    if (!permisos.granted){
      this.getContacts();
      return;
    }
    this.getContacts();
  }

  async getContacts() {
    Contacts.getContacts().then(result => {
      console.log('result is:' , result);
      this.contacts = result.contacts;
    });
  }

  insertarContactos(nombre: string, telefono: string){
    this.telefonoParsed = telefono.replace(' ', '');
    this.telefonoParsed = this.telefonoParsed.replace(' ', '');
    console.log(`parsing ${telefono} => ${this.telefonoParsed}`);
    if (Number(this.telefonoParsed.substr(-9,9)) <= 999999999) {
      console.log('Es numero valido');
      this.database.importarClientes(nombre, Number(this.telefonoParsed.substr(-9,9)) )
        .then(() => {
        });
    } else{
      console.log('No es valido el numero');
    }
  }

  importarContactos() {
    console.log('cantidad de contacto', this.contacts.length);
    for(let i = 0; i <=this.contacts.length-1; i++) {
      if(this.contacts[i].phoneNumbers.length > 0){
        this.insertarContactos(this.contacts[i].displayName,this.contacts[i].phoneNumbers[0].number);
        console.log('nombre', this.contacts[i].displayName);
        console.log('telefono', this.contacts[i].phoneNumbers[0].number);
      }
    }
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Terminado',
      message: 'Contactos Importados',
      buttons: ['OK']
    });
    await alert.present();
  }
}

