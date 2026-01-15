import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../database.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as moment from 'moment';

@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.page.html',
  styleUrls: ['./deudas.page.scss'],
})

export class DeudasPage implements OnInit {

  textoBuscar = '';
  clientes: any = [];
  clientesFiltrados: any = [];
  recordatorio: any = [];
  metodoPago: any = [];
  recordar = 0;
  clientesId = 0;
  productosId = 0;
  tipopagoId = 0;
  idDeuda: any = [];
  id = 0;
  auxId = 0;
  auxIdPago = 1;

  deudas: any = [];
  historiales: any = [];
  fecha: any = [];
  detalles: any = [];
  auxfecha: Date = new Date();
  estado = false;

  seleccionarCli = 0;
  seleccionarPro = 0;
  seleccionarRec = 0;
  seleccionarMet = 0;
  productos: any = [];
  aux: any = [];

  editMode = false;
  selectedProductosId = 0;
  selectedClientesId = 0;
  montoDeuda = 0;
  editId = 0;

  constructor(public database: DatabaseService) {
    this.getProductos();
    this.getClientes();
    this.getDeudas();
    this.getRecordatorio();
    this.getMetodoPago();
  }



  ngOnInit() {

  }

  cambioFecha(event){
    this.fecha = moment(event.detail.value).format('DD/MM/YYYY');
  }

  ionViewWillEnter() {
  }

  getId(x){
    this.auxId = Number(x);
  }

  portChangeC(event: {
    component: IonicSelectableComponent; value: any;
  }) {
    if (event.value) {
      this.clientesId = event.value.id;
      console.log('Cliente seleccionado:', event.value.name, 'ID:', this.clientesId);
    }
  }

  portChangeP(event: {
    component: IonicSelectableComponent; value: any;
  }) {
    if (event.value) {
      this.productosId = event.value.id;
      console.log('Producto seleccionado:', event.value.name, 'ID:', this.productosId);
    }
  }

  portChangeR(event: {
    component: IonicSelectableComponent; value: any;
  }) {
    if (event.value) {
      this.recordar = event.value.id;
      console.log('Recordatorio seleccionado:', this.recordar);
    }
  }

  portChangeM(event: {
    component: IonicSelectableComponent; value: any;
  }) {
    if (event.value) {
      this.tipopagoId = event.value.id;
      console.log('Método pago seleccionado:', this.tipopagoId);
    }
  }

  getProductos() {
    this.database.getProductos().then((data) => {
      this.productos = [];
      if (data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.productos.push(data.values[i]);
        }
      }
    });
  }

  getClientes() {
    this.database.getClientes().then((data) => {
      this.clientes = [];
      if (data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.clientes.push(data.values[i]);
        }
      }
      // Mostrar solo los primeros 20 inicialmente para carga rápida
      this.clientesFiltrados = this.clientes.slice(0, 20);
      console.log('clientes', this.clientes.length);
    });
  }

  // Búsqueda asíncrona de clientes
  buscarClientes(event: { component: IonicSelectableComponent; text: string }) {
    const texto = event.text.trim().toLowerCase();

    // Si no hay texto, mostrar los primeros 20
    if (!texto) {
      event.component.items = this.clientes.slice(0, 20);
      event.component.endSearch();
      return;
    }

    // Filtrar clientes por nombre o teléfono
    const filtrados = this.clientes.filter((cliente: any) => {
      const nombre = (cliente.name || '').toLowerCase();
      const telefono = (cliente.telefono || '').toString();
      return nombre.includes(texto) || telefono.includes(texto);
    });

    // Limitar resultados a 50 para rendimiento
    event.component.items = filtrados.slice(0, 50);
    event.component.endSearch();
  }

  getRecordatorio() {
    this.database.getRecordatorio().then((data) => {
      this.recordatorio = [];
      if (data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.recordatorio.push(data.values[i]);
        }
      }
      console.log('recordatorio',this.recordatorio);
    });
  }

  getMetodoPago() {
    this.database.getMetodoPago().then((data) => {
      this.metodoPago = [];
      if (data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.metodoPago.push(data.values[i]);
        }
      }
      console.log('metodoPago??',this.metodoPago);
    });
  }

  addDeudas() {
    if (this.clientesId === 0) {
      alert('Seleccionar el cliente');
      return;
    }

    if (this.productosId === 0) {
      alert('Seleccionar el producto');
      return;
    }

    if (this.montoDeuda === 0) {
      alert('Ingrese el Monto de la Deuda');
      return;
    }

    if ( this.fecha.length  === 0) {
      alert('Ingrese la fecha');
      return;
    }

    // metodo de pago verificar
    if ( this.tipopagoId === 0) {
      alert('Ingrese el metodo de pago');
      return;
    }

    // elegir recordatorio
    console.log('recordar ', this.recordar);
    if (this.recordar === 1){
      this.auxId = 1;
    }else{
      this.auxId = 2;
    }

    // elegir metodo de pago
    console.log('metodo de pago ', this.tipopagoId);
    if (this.tipopagoId === 3){
      this.auxIdPago = 3;
    } else if (this.tipopagoId === 2){
      this.auxIdPago = 2;
    } else{
      //efectivo
      this.auxIdPago = 1;
    }


    if (this.editMode) {
      if (this.estado === true){
        this.database
          .editDeudas(this.montoDeuda, this.editId, this.fecha, this.auxIdPago)
          .then((data) => {
            this.montoDeuda = 0;
            this.editMode = false;
            this.editId = 0;
            this.selectedProductosId = 0;
            this.selectedClientesId = 0;
            this.tipopagoId = 0;
            alert(data);
          });
      }} else {
      this.database
        .addDeudas(this.clientesId, this.productosId, this.montoDeuda,
          this.fecha, this.auxId, this.detalles, this.auxIdPago)
        .then((data) => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
          this.recordar = 0;
          this.tipopagoId = 0;
          alert(data);
        });

      this.database
        .addHistorialNuevo(this.clientesId, this.productosId,this.montoDeuda,
          this.fecha, this.detalles, this.auxIdPago)
        .then(() => {
          this.montoDeuda = 0;
          this.productosId = 0;
          this.clientesId = 0;
          this.recordar = 0;
          this.tipopagoId = 1;
        });

    }
  }

  getDeudas() {
    this.database.getDeudas().then((data) => {
      this.deudas = [];
      if (data.values.length > 0) {
        for (let i = 0; i < data.values.length; i++) {
          this.deudas.push(data.values[i]);
        }
      }
      console.log('deudas??',this.deudas);
    });
  }

  editDeudas(deudas: any){
    this.editMode = true;
    this.selectedClientesId = deudas.clientesId;
    this.selectedProductosId = deudas.productosId;
    this.montoDeuda = deudas.montoDeuda;
    this.editId = deudas.id;
    this.fecha = deudas.fecha;
  }

  deleteDeudas(id: number) {
    this.database.deleteDeudas(id).then((data) => {
      alert(data);
      this.getDeudas();
    });
  }

}
