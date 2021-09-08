import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  paisCodigo = '595';
  whatsappNumero = '994452649';
  url = 'https://api.whatsapp.com/send?phone='+this.paisCodigo+this.whatsappNumero;
  constructor() { }

  ngOnInit() {
  }

}
