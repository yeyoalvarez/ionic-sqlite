import { Component, OnInit } from '@angular/core';
import {ContactFieldType, Contacts, IContactFindOptions} from '@ionic-native/contacts/ngx';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  ourtype: ContactFieldType[] = ['displayName'];
  contactsFound = [];


  constructor(public navCtrl: NavController, private  contacts: Contacts) {
    this.search('');
  }

  ngOnInit() {
  }





  search(q){
    const option: IContactFindOptions = {
      filter:q
    };
    this.contacts.find(this.ourtype,option).then(conts =>{
      this.contactsFound = conts;
    });
  }

  onkeyUp(ev){
    this.search(ev.target.value);
  }

}
