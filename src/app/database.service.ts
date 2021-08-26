import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  databaseObj: SQLiteObject;
  tables = {
    productos: 'productos',
    clientes: 'clientes',
    deudas: 'deudas',
  };

  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    await this.sqlite
      .create({
        name: 'database',
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
      `CREATE TABLE IF NOT EXISTS ${this.tables.productos} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.clientes} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      productosId INTEGER UNSIGNED NOT NULL, name VARCHAR(255) NOT NULL)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.deudas} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      productosId INTEGER UNSIGNED NOT NULL, clientesId INTEGER UNSIGNED NOT NULL,
      monto INTEGER UNSIGNED NOT NULL)`,
      []
    );

  }

  async addProductos(name: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.productos} (name) VALUES ('${name}')`,
        []
      )
      .then(() => 'Producto Creado')
      .catch((e) => {
        if (e.code === 6) {
          return 'Producto ya existe';
        }

        return 'error al crear producto' + JSON.stringify(e);
      });
  }

  async getProductos() {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.productos} ORDER BY name ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener productos' + JSON.stringify(e));
  }

  async deleteProductos(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.productos} WHERE id = ${id}`, [])
      .then(() => 'eliminar productos')
      .catch((e) => 'error al eliminar producto' + JSON.stringify(e));
  }

  async editProductos(name: string, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.productos} SET name = '${name}' WHERE id = ${id}`,
        []
      )
      .then(() => 'actualizar producto')
      .catch((e) => {
        if (e.code === 6) {
          return 'producto ya existe';
        }

        return 'error al actualizar producto' + JSON.stringify(e);
      });
  }

  async addClientes(name: string, productosId: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.clientes} (name, productosId) VALUES ('${name}', ${productosId})`,
        []
      )
      .then(() => 'Crear cliente')
      .catch((e) => 'error al crear cliente ' + JSON.stringify(e));
  }

  async getClientes() {
    return this.databaseObj
      .executeSql(
        `SELECT clientes.id, clientes.productosId, clientes.name as clientes,
        productos.name as producto FROM clientes INNER JOIN productos ON productos.id = clientes.productosId
        ORDER BY clientes ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener clientes' + JSON.stringify(e));
  }

  async deleteClientes(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.clientes} WHERE id = ${id}`, [])
      .then(() => 'cliente eliminado')
      .catch((e) => 'error al eliminar cliente' + JSON.stringify(e));
  }

  async editClientes(name: string, productosId: number, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.clientes} SET name = '${name}', productosId = ${productosId} WHERE id = ${id}`,
        []
      )
      .then(() => 'cliente actualizado')
      .catch((e) => 'error al actualizar cliente ' + JSON.stringify(e));
  }

  async addDeudas(clientesId: number, productosId: number, monto: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.deudas} (clientesId, productosId, monto)
         VALUES ('${clientesId}', ${productosId}, ${monto})`,
        []
      )
      .then(() => 'Crear deuda')
      .catch((e) => 'error al crear deuda ' + JSON.stringify(e));
  }

  async getDeudas() {
    return this.databaseObj
      .executeSql(
        `SELECT clientes.id, clientes.productosId, clientes.name as clientes,
        deudas.monto as deudas
        FROM clientes JOIN productos ON productos.id = clientes.productosId
        JOIN deudas ON  deudas.clientesId = clientes.id
        ORDER BY clientes ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener deudas' + JSON.stringify(e));
  }

  async editDeudas(clientesId: number, productosId: number, monto: number, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.deudas} SET name = '${monto}',
         productosId = ${productosId}, clientesId = ${clientesId}
          WHERE id = ${id}`,
        []
      )
      .then(() => 'deuda actualizada')
      .catch((e) => 'error al actualizar deuda ' + JSON.stringify(e));
  }


}
