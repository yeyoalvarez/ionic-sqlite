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

  toLocalDest = 'path/to/local/destination/file.ext';
  fileid = 'GoogleDrive_FileID';

  constructor() { }

  ngOnInit() {
  }

// getDatabase(){
//   window.plugins.gdrive.downloadFile(toLocalDest, fileid,
//     function (response) {
//       //simple response message with the status
//     },
//     function (error){
//       console.log(error);
//     }
//   );
//
// }


}


