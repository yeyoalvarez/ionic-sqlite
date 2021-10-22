import { Component, OnInit } from '@angular/core';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  constructor(private sqliteDbCopy: SqliteDbCopy) { }

  ngOnInit() {
  }

  backupDB(){
    this.sqliteDbCopy.copy('database.db', 0)
      .then((res: any) => console.log('Backup Realizado'))
      .catch((error: any) => console.error(error));
  }
}
