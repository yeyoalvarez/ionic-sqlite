import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../database.service';
import * as moment from 'moment';

@Component({
  selector: 'app-deudas-cobrar',
  templateUrl: './deudas-cobrar.page.html',
  styleUrls: ['./deudas-cobrar.page.scss'],
})
export class DeudasCobrarPage implements OnInit {

  textoBuscar = '';
  deudas: any = [];
  p = 1; //variable de paginacion


  constructor(public database: DatabaseService) {
    this.database.createDatabase().then(() => {
      this.getDeudas();
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getDeudas();
  }

  getDeudas() {
    this.database.getDeudas().then((data) => {
      this.deudas = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.deudas.push(data.rows.item(i));
        }
      }
    });
  }

  testFecha(fec: string, tiempo: string){
    const date = moment(new Date(), 'DD/MM/YYYY').toDate();
    console.log('date  ', date );
    console.log('fec  ', fec );
    const date2 = moment(fec, 'DD/MM/YYYY').toDate();

    const milisegundosDia = 24*60*60*1000;
    const milisegTranscurridos = Math.abs(date.getTime() - date2.getTime());
    const diastrasncurridos = Math.round(milisegTranscurridos/milisegundosDia);

    if(tiempo==='Semanal')
    {
      console.log('semanal ', diastrasncurridos );
      if(diastrasncurridos>=7){
        return true;
      }
    }else if(tiempo==='Mensual')
    {
      console.log('Mensual ', diastrasncurridos );
      if(diastrasncurridos>=30){
        return true;
      }
    }else{
      return false;
    }

    console.log('date ', date );
    console.log('date2 ', date2 );
    console.log('diferencia fechas', diastrasncurridos );
  }

}
