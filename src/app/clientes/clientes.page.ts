import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import {NgxPaginationModule} from 'ngx-pagination';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  clienteNombre = '';
  clientes: any = [];
  telefonos: any = [];
  telefono=9;
  paisCodigo = '595';
  idExisteDeuda = 0;
  idExDeuda: any = [];

  editMode = false;
  editId = 0;
  selectedItem: any;
  textoBuscar = '';
  p = 1; //variable de paginacion

  constructor(public database: DatabaseService,
              public loadingController: LoadingController,
              public alertController: AlertController) {
    this.database.createDatabase().then(() => {
      this.getClientes();
    });
  }

  ngOnInit() {
    this.pantallaEspera();
    this.getClientes();

  }

  async pantallaEspera() {
    const loading = await this.loadingController.create({
      message: 'Cargando Clientes',
      duration: 2000
    });
    await loading.present();
  }

  addClientes() {
    if (!this.clienteNombre.length) {
      alert('Ingrese el nombre del cliente');
      return;
    }
    if (this.telefono === 9) {
      alert('ingrese un numero de telefono');
      return;
    }

    if (this.editMode) {
      // edit category
      this.database
        .editClientes(this.clienteNombre, this.editId, this.telefono)
        .then((data) => {
          this.clienteNombre = '';
          this.telefono = 9;
          this.editMode = false;
          this.editId = 0;
          alert(data);
          this.getClientes();
        });
    } else {
      // add category
      this.database.addClientes(this.clienteNombre, this.telefono).then((data) => {
        this.clienteNombre = '';
        this.telefono = 9;
        alert(data);
        this.getClientes();
      });
    }
  }



  getClientes() {
    this.database.getClientes().then((data) => {
      this.clientes = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.clientes.push(data.rows.item(i));
        }
      }
    });
  }

  deleteClientes(id: number) {

    this.database.existenciaDeuda(Number(id)).then((data) => {
      this.idExDeuda.push(data.rows.item(0));
    });
    console.log('de', this.idExDeuda);
    console.log('tiene deudas ', this.idExDeuda[0].cantDeudas);

    if(this.idExDeuda[0].cantDeudas === 0){
      this.database.deleteClientes(id).then((data) => {
        alert(data);
        this.getClientes();
      });
    }else{
      this.presentAlert();
    }

  }

  editClientes(cliente: any) {
    this.editMode = true;
    this.clienteNombre = cliente.name;
    this.telefono = cliente.telefono;
    this.editId = cliente.id;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No se puede eliminar',
      message: 'El cliente tiene historial de deudas',
      buttons: ['OK']
    });
    await alert.present();
  }

}
