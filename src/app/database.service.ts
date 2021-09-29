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
    historial: 'historial',
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
       name VARCHAR(255) NOT NULL, telefono INTEGER UNSIGNED NOT NULL)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.deudas} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      productosId INTEGER UNSIGNED NOT NULL, clientesId INTEGER UNSIGNED NOT NULL,
      monto INTEGER UNSIGNED NOT NULL, fecha VARCHAR(255),estado BOOLEAN)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS historial(id INTEGER PRIMARY KEY AUTOINCREMENT,
      idProducto INTEGER UNSIGNED NOT NULL, idCliente INTEGER UNSIGNED NOT NULL,
      idDeuda INTEGER UNSIGNED NOT NULL, estado BOOLEAN,
      montos INTEGER UNSIGNED NOT NULL, fechas VARCHAR(255))`,
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
      .then(() => 'producto eliminado')
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

  async addClientes(name: string, telefono: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.clientes} (name, telefono) VALUES ('${name}',${telefono})`,
        []
      )
      .then(() => 'Cliente Creado')
      .catch((e) => {
        if (e.code === 6) {
          return 'cliente ya existe';
        }

        return 'error al crear cliente' + JSON.stringify(e);
      });
  }

  async getClientes() {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.clientes} ORDER BY name ASC`,
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

  async editClientes(name: string, id: number, telefono: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.clientes} SET name = '${name}',
         telefono = ${telefono}
         WHERE id = ${id}`,
        []
      )
      .then(() => 'actualizar cliente')
      .catch((e) => {
        if (e.code === 6) {
          return 'cliente ya existe';
        }

        return 'error al actualizar cliente' + JSON.stringify(e);
      });
  }

  async addDeudas(clientesId: number, productosId: number, monto: number, fecha: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.deudas} (clientesId, productosId, monto, fecha, estado)
         VALUES ('${clientesId}', ${productosId}, ${monto},'${fecha}','TRUE')`,
        []
      )
      .then(() => 'deuda creada')
      .catch((e) => 'error al crear deuda ' + JSON.stringify(e));
  }

  async getDeudas() {
    return this.databaseObj
      .executeSql(
        `SELECT deudas.id, deudas.productosId,
        deudas.clientesid,
        deudas.monto as monto,
        clientes.name as clientes,
        productos.name as productos, deudas.fecha as fecha,
        clientes.telefono as telefono
        FROM deudas
        JOIN productos ON productos.id = deudas.productosId
        JOIN clientes ON  clientes.id = deudas.clientesid
        where deudas.estado =='TRUE'
        ORDER BY clientes ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener deudas' + JSON.stringify(e));
  }

  async editDeudas(clientesId: number, productosId: number, monto: number, id: number, fecha: string) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.deudas} SET monto = ${monto}
          WHERE id = ${id}`,
        []
      )
      .then(() => 'deuda actualizada')
      .catch((e) => 'error al actualizar deuda ' + JSON.stringify(e));
  }

  async deleteDeudas(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.deudas} WHERE id = ${id}`, [])
      .then(() => 'deuda eliminada')
      .catch((e) => 'error al eliminar deuda ' + JSON.stringify(e));
  }

  async addHistorial(clientesId: number, productosId: number, idDeuda: number, monto: number, fecha: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.historial} (idCliente, idProducto, idDeuda, montos, fechas,estado)
         VALUES ('${clientesId}', ${productosId},${idDeuda}, ${monto},'${fecha}','TRUE')`,
        []
      )
      .then(() => 'Historial actualizado')
      .catch((e) => 'error al crear historial' + JSON.stringify(e));
  }

  async getHistorial() {
    return this.databaseObj
      .executeSql(
        `SELECT historial.id, historial.idProducto, historial.idDeuda,
        historial.idCliente,
        historial.montos as montos,
        clientes.name as clientes,
        productos.name as productos, historial.fechas as fechas,
        clientes.telefono as telefono,
        historial.estado AS estado
        FROM historial
        JOIN productos ON productos.id = historial.idProducto
        JOIN clientes ON  clientes.id = historial.idCliente
        ORDER BY clientes ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener historial' + JSON.stringify(e));
  }

  async getLastDeuda() {
    return this.databaseObj
      .executeSql(
        `SELECT MAX(id) AS id from deudas`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener deudas' + JSON.stringify(e));
  }
}
