import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Contact, Contacts} from '@capacitor-community/contacts';
import { ToastController } from '@ionic/angular';

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

  contacts: Observable<Contact[]>;
  constructor(
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.getPermissions();
    this.getContacts();
  }

  async getPermissions(): Promise<void> {
    console.log('button clicked');
    Contacts.getPermissions();
  }

  async getContacts(): Promise<void> {
    console.log('tesbutton clicked');
    this.getPermissions();
    Contacts.getContacts().then(result => {
      console.log('result is:' , result);
      const phoneContacts: Contact[] = result.contacts;
      this.contacts = of(phoneContacts);

    });
  }




}
