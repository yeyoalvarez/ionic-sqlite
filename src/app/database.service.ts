import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  databaseObj: SQLiteObject;
  tables = {
    categories: 'categories',
    persons: 'persons',
  };

  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    await this.sqlite
      .create({
        name: 'ionic_sqlite_crud',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
      })
      .catch((e) => {
        alert('error on creating database ' + JSON.stringify(e));
      });

    await this.createTables();
  }

  async createTables() {
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.categories} (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL UNIQUE)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.persons} (id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER UNSIGNED NOT NULL, name VARCHAR(255) NOT NULL)`,
      []
    );
  }

  async addCategory(name: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.categories} (name) VALUES ('${name}')`,
        []
      )
      .then(() => 'category created')
      .catch((e) => {
        if (e.code === 6) {
          return 'category already exists';
        }

        return 'error on creating category ' + JSON.stringify(e);
      });
  }

  async getCategories() {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.categories} ORDER BY name ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error on getting categories ' + JSON.stringify(e));
  }

  async deleteCategory(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.categories} WHERE id = ${id}`, [])
      .then(() => 'category deleted')
      .catch((e) => 'error on deleting category ' + JSON.stringify(e));
  }

  async editCategory(name: string, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.categories} SET name = '${name}' WHERE id = ${id}`,
        []
      )
      .then(() => 'category updated')
      .catch((e) => {
        if (e.code === 6) {
          return 'category already exist';
        }

        return 'error on updating category ' + JSON.stringify(e);
      });
  }

}
