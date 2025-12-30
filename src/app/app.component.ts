import { Component } from '@angular/core';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Productos', url: '/productos', icon: 'cart' },
    { title: 'Clientes', url: '/clientes', icon: 'person-add' },
    { title: 'Deudas Clientes', url: '/deudas-clientes', icon: 'people' },
    { title: 'Deudas por Cobrar', url: '/deudas-cobrar', icon: 'calendar' },
    { title: 'Contactos', url: '/contactos', icon: 'people' },
    { title: 'Deudas Canceladas', url: '/deudas-canceladas', icon: 'wallet' },
    { title: 'Deudas Total', url: '/deudas-total', icon: 'wallet' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private permissions: AndroidPermissions,
              private platform: Platform) {
    this.initializarApp();
  }

  initializarApp(){
    this.platform.ready().then(() => {
    this.permissions.checkPermission
    (this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then((result) =>{
      if(!result.hasPermission){
        this.permissions.requestPermission
        (this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      }
    },(err) => {
      this.permissions.requestPermission
      (this.permissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      });
    });
  }

}
