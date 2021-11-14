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

  async backup() {
    await   this.sqliteDbCopy.copy('database.db', 0)
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));
  }

}
