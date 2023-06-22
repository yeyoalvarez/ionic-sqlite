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
    recordatorioPagos: 'recordatorioPagos',
    metodoPago: 'metodoPago'
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
       name VARCHAR(255) NOT NULL, telefono INTEGER UNSIGNED NOT NULL, ci INTEGER, direccion VARCHAR(255) )`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.deudas} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      productosId INTEGER UNSIGNED NOT NULL, clientesId INTEGER UNSIGNED NOT NULL,
      monto INTEGER UNSIGNED NOT NULL, fecha VARCHAR(255),estado BOOLEAN,
      recordatorioId INTEGER UNSIGNED NOT NULL, detalles VARCHAR(255) )`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS historial(id INTEGER PRIMARY KEY AUTOINCREMENT,
      idProducto INTEGER UNSIGNED NOT NULL, idCliente INTEGER UNSIGNED NOT NULL,
      idDeuda INTEGER UNSIGNED NOT NULL, estado BOOLEAN,
      montos INTEGER UNSIGNED NOT NULL, fechas VARCHAR(255),
      detalles VARCHAR(255) )`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.recordatorioPagos} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      recordatorio VARCHAR(255) NOT NULL UNIQUE)`,
      []
    );

    /* valores por defaul en la tabla recordatorio, mensual y semanal*/
    await this.databaseObj.executeSql(
      `INSERT INTO ${this.tables.recordatorioPagos} (recordatorio)
      SELECT 'Mensual'
      WHERE NOT EXISTS(SELECT 1 FROM recordatorioPagos WHERE recordatorio = 'Mensual');`,
      []
    );

    await this.databaseObj.executeSql(
      `INSERT INTO ${this.tables.recordatorioPagos} (recordatorio)
      SELECT 'Semanal'
      WHERE NOT EXISTS(SELECT 1 FROM recordatorioPagos WHERE recordatorio = 'Semanal'); `,
      []
    );

    /*nueva tabla metodo de pago*/
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.metodoPago} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE, abreviatura VARCHAR(2) NOT NULL UNIQUE)`,
      []
    );

    // insertar configuraciones de tabla metodos de pago
    // await this.databaseObj.executeSql(
    //   `ALTER TABLE deudas ADD COLUMN tipoPagoId INTEGER not NULL DEFAULT 1;
    //     ALTER TABLE historial ADD COLUMN tipoPagoId INTEGER not NULL DEFAULT 1;
    //     INSERT INTO metodoPago (id, abreviatura, name) VALUES (1,'E','EFECTIVO'),
    //      (2,'TB','TRANSFERENCIA BANCARIA'), (3,'G','GIROS');`,
    //   []
    // );
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

  async addClientes(name: string, telefono: number, ci: number, direccion: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.clientes} (name, telefono, ci, direccion) VALUES ('${name}',${telefono},
        ${ci}, '${direccion}')`,
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

  async importarClientes(name: string, telefono: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.clientes} (name, telefono)
        SELECT '${name}', ${telefono}
        WHERE NOT EXISTS(SELECT 1 FROM clientes WHERE telefono = ${telefono})`,
        []
      )
      .catch((e) => 'error al importar contacto' + JSON.stringify(e));
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

  async getClienteDetalles(id: number) {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.clientes}
        WHERE id = ${id}`,
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

  async editClientes(name: string, id: number, telefono: number, ci: number,
                     direccion: string) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.clientes} SET name = '${name}',
         telefono = ${telefono}, ci = ${ci}, direccion = '${direccion}'
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

  async addDeudas(clientesId: number, productosId: number, monto: number, fecha: string, recordar: number,
                  detalles: string, tipopagoId: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.deudas} (clientesId, productosId, monto, fecha, estado, recordatorioId,
        detalles, tipoPagoId)
         SELECT '${clientesId}', ${productosId}, ${monto},'${fecha}','TRUE', ${recordar}, '${detalles}', '${tipopagoId}' `,
        []
      )
      .then(() => 'deuda creada')
      .catch((e) => 'error al crear deuda ' + JSON.stringify(e));
  }

  async getDeudas() {
    return this.databaseObj
      .executeSql(
        `SELECT deudas.id, deudas.productosId,
        deudas.clientesId,
        deudas.monto as monto,
        clientes.name as clientes,
        productos.name as productos, deudas.fecha as fecha,
        clientes.telefono as telefono,
        recordatorioPagos.recordatorio as recordatorio,
        deudas.tipoPagoId as tipopagoId
        FROM deudas
        JOIN productos ON productos.id = deudas.productosId
        JOIN clientes ON  clientes.id = deudas.clientesid
        JOIN recordatorioPagos ON recordatorioPagos.id = deudas.recordatorioid
        where deudas.estado =='TRUE'
        ORDER BY clientes ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener deudas' + JSON.stringify(e));
  }

  async getDeudasCanceladas() {
    return this.databaseObj
      .executeSql(
        `SELECT historial.idCliente,
        historial.idDeuda AS id,
        historial.montos as monto,
        clientes.name as clientes,
        historial.fechas as fecha
        FROM historial
        JOIN clientes ON  clientes.id = historial.idCliente
        where historial.montos = 0
        ORDER by clientes`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener deudas' + JSON.stringify(e));
  }

  async editDeudas(monto: number, id: number, fecha: string, tipopagoId: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.deudas} SET monto = ${monto},
        fecha = ${fecha}, tipoPagoId = ${tipopagoId}
        WHERE id = ${id}`,
        []
      )
      .then(() => 'deuda actualizada')
      .catch((e) => 'error al actualizar deuda ' + JSON.stringify(e));
  }

  async deudaCancelada(monto: number, id: number, fecha: string, metodoPago: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.deudas} SET monto = 0, estado = 'FALSE',
         fecha = '${fecha}', tipoPagoId = '${metodoPago}'
         WHERE id = ${id} and ${monto} = 0`,
        []
      )
      .then(() => 'Deuda Cancelada')
      .catch((e) => 'error al cancelar deuda' + JSON.stringify(e));
  }

  async deleteDeudas(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.deudas} WHERE id = ${id}`, [])
      .then(() => 'deuda eliminada')
      .catch((e) => 'error al eliminar deuda ' + JSON.stringify(e));
  }

  /*funciones para la tabla historia de deudas*/

  async addHistorialNuevo(clientesId: number, productosId: number, monto: number, fecha: string, detalles: string,
                          tipoPagoId: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.historial} (idCliente, idProducto, idDeuda, montos, fechas,estado, detalles,
        tipoPagoId)
         VALUES ('${clientesId}', ${productosId},(SELECT MAX(id) AS id from deudas), ${monto},'${fecha}','TRUE',
         '${detalles}', '${tipoPagoId}')`,
        []
      )
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
        historial.estado AS estado,
        historial.detalles AS detalles,
        metodoPago.abreviatura as tipopago
        FROM historial
        JOIN productos ON productos.id = historial.idProducto
        JOIN clientes ON  clientes.id = historial.idCliente
        JOIN metodoPago ON metodoPago.id = historial.tipoPagoId
        ORDER BY clientes ASC`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener historial' + JSON.stringify(e));
  }

  async addHistorial(clientesId: number, productosId: number, idDeuda: number, monto: number,
                     fecha: string, detalles: string, tipoPagoId: number) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.historial} (idCliente, idProducto, idDeuda, montos, fechas,
         estado,detalles, tipoPagoId )
         VALUES ('${clientesId}', ${productosId},${idDeuda}, ${monto},'${fecha}',
         'TRUE', '${detalles}', '${tipoPagoId}')`,
        []
      )
      .catch((e) => 'error al crear historial' + JSON.stringify(e));
  }

  async getLastMonto(idDeuda: number) {
    return this.databaseObj
      .executeSql(
        `SELECT montos AS monto
        from historial
        WHERE idDeuda = ${idDeuda} AND
        id = (SELECT max(id)
        from historial
        WHERE idDeuda = ${idDeuda}); `,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener ultimo monto' + JSON.stringify(e));
  }

  async getLastDeudaId(idDeuda: number) {
    return this.databaseObj
      .executeSql(
        `SELECT id AS id
        from historial
        WHERE idDeuda = ${idDeuda} AND
        id = (SELECT max(id)
        from historial
        WHERE idDeuda = ${idDeuda}); `,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener ultimo id' + JSON.stringify(e));
  }

  async getFirstDeudaId(idDeuda: number) {
    return this.databaseObj
      .executeSql(
        `SELECT id AS id
        from historial
        WHERE idDeuda = ${idDeuda} AND
        id = (SELECT min(id)
        from historial
        WHERE idDeuda = ${idDeuda}); `,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener primer id' + JSON.stringify(e));
  }

  async existenciaDeuda(id: number) {
    return this.databaseObj
      .executeSql(
        `SELECT COUNT(*) as cantDeudas
        from historial
        WHERE idCliente = ${id}`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al buscar si existen deudas' + JSON.stringify(e));
  }

  async getRecordatorio(){
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.recordatorioPagos}`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener el recordatorio' + JSON.stringify(e));
  }

  async getMetodoPago(){
    return this.databaseObj
      .executeSql(
        `SELECT * from ${this.tables.metodoPago}`,
        []
      )
      .then((res) => res)
      .catch((e) => 'error al obtener el metodo de pago' + JSON.stringify(e));
  }

}
