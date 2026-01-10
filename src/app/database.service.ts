import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, DBSQLiteValues } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection;
  private platform: string;
  dbReady: boolean = false;

  tables = {
    productos: 'productos',
    clientes: 'clientes',
    deudas: 'deudas',
    historial: 'historial',
    recordatorioPagos: 'recordatorioPagos',
    metodoPago: 'metodoPago'
  };

  constructor() {
    this.platform = Capacitor.getPlatform();
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async createDatabase() {
    try {
      // Crear o abrir la base de datos
      const ret = await this.sqlite.checkConnectionsConsistency();
      const isConn = (await this.sqlite.isConnection('database', false)).result;

      if (ret.result && isConn) {
        this.db = await this.sqlite.retrieveConnection('database', false);
      } else {
        this.db = await this.sqlite.createConnection('database', false, 'no-encryption', 1, false);
      }

      await this.db.open();
      await this.createTables();
      await this.migrateDatabase();
      this.dbReady = true;
    } catch (e) {
      alert('error on creating database ' + JSON.stringify(e));
    }
  }

  async createTables() {
    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tables.productos} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE)`
    );

    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tables.clientes} (id INTEGER PRIMARY KEY AUTOINCREMENT,
       name VARCHAR(255) NOT NULL, telefono INTEGER UNSIGNED NOT NULL, ci INTEGER, direccion VARCHAR(255) )`
    );

    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tables.deudas} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      productosId INTEGER UNSIGNED NOT NULL, clientesId INTEGER UNSIGNED NOT NULL,
      monto INTEGER UNSIGNED NOT NULL, fecha VARCHAR(255),estado BOOLEAN,
      recordatorioId INTEGER UNSIGNED NOT NULL, detalles VARCHAR(255), tipoPagoId INTEGER )`
    );

    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS historial(id INTEGER PRIMARY KEY AUTOINCREMENT,
      idProducto INTEGER UNSIGNED NOT NULL, idCliente INTEGER UNSIGNED NOT NULL,
      idDeuda INTEGER UNSIGNED NOT NULL, estado BOOLEAN,
      montos INTEGER UNSIGNED NOT NULL, fechas VARCHAR(255),
      detalles VARCHAR(255), tipoPagoId INTEGER )`
    );

    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tables.recordatorioPagos} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      recordatorio VARCHAR(255) NOT NULL UNIQUE)`
    );

    /* valores por defaul en la tabla recordatorio, mensual y semanal*/
    await this.db.execute(
      `INSERT INTO ${this.tables.recordatorioPagos} (recordatorio)
      SELECT 'Mensual'
      WHERE NOT EXISTS(SELECT 1 FROM recordatorioPagos WHERE recordatorio = 'Mensual');`
    );

    await this.db.execute(
      `INSERT INTO ${this.tables.recordatorioPagos} (recordatorio)
      SELECT 'Semanal'
      WHERE NOT EXISTS(SELECT 1 FROM recordatorioPagos WHERE recordatorio = 'Semanal'); `
    );

    /*nueva tabla metodo de pago*/
    await this.db.execute(
      `CREATE TABLE IF NOT EXISTS ${this.tables.metodoPago} (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE, abreviatura VARCHAR(2) NOT NULL UNIQUE)`
    );
  }

  async migrateDatabase() {
    try {
      // Verificar y agregar columna tipoPagoId a la tabla historial si no existe
      const historialInfo = await this.db.query(`PRAGMA table_info(historial)`);
      const hasTipoPagoId = historialInfo.values?.some((col: any) => col.name === 'tipoPagoId');

      if (!hasTipoPagoId) {
        console.log('Agregando columna tipoPagoId a historial');
        await this.db.execute(`ALTER TABLE historial ADD COLUMN tipoPagoId INTEGER DEFAULT 1`);
      }

      // Verificar y agregar columna tipoPagoId a la tabla deudas si no existe
      const deudasInfo = await this.db.query(`PRAGMA table_info(deudas)`);
      const hasTipoPagoIdDeudas = deudasInfo.values?.some((col: any) => col.name === 'tipoPagoId');

      if (!hasTipoPagoIdDeudas) {
        console.log('Agregando columna tipoPagoId a deudas');
        await this.db.execute(`ALTER TABLE deudas ADD COLUMN tipoPagoId INTEGER DEFAULT 1`);
      }

      // Insertar métodos de pago por defecto si no existen
      await this.db.execute(
        `INSERT INTO ${this.tables.metodoPago} (name, abreviatura)
        SELECT 'Efectivo', 'EF'
        WHERE NOT EXISTS(SELECT 1 FROM metodoPago WHERE abreviatura = 'EF');`
      );

      await this.db.execute(
        `INSERT INTO ${this.tables.metodoPago} (name, abreviatura)
        SELECT 'Transferencia', 'TR'
        WHERE NOT EXISTS(SELECT 1 FROM metodoPago WHERE abreviatura = 'TR');`
      );

      await this.db.execute(
        `INSERT INTO ${this.tables.metodoPago} (name, abreviatura)
        SELECT 'Tarjeta', 'TA'
        WHERE NOT EXISTS(SELECT 1 FROM metodoPago WHERE abreviatura = 'TA');`
      );

      console.log('Migración de base de datos completada');
    } catch (e) {
      console.error('Error en migración de base de datos:', e);
    }
  }

  async addProductos(name: string): Promise<string> {
    try {
      await this.db.execute(
        `INSERT INTO ${this.tables.productos} (name) VALUES ('${name}')`
      );
      return 'Producto Creado';
    } catch (e: any) {
      if (e.message && e.message.includes('UNIQUE constraint')) {
        return 'Producto ya existe';
      }
      return 'error al crear producto' + JSON.stringify(e);
    }
  }

  async getProductos(): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.tables.productos} ORDER BY name ASC`
      );
      return result;
    } catch (e) {
      console.error('error al obtener productos', e);
      return { values: [] };
    }
  }

  async deleteProductos(id: number): Promise<string> {
    try {
      await this.db.execute(`DELETE FROM ${this.tables.productos} WHERE id = ${id}`);
      return 'producto eliminado';
    } catch (e) {
      return 'error al eliminar producto' + JSON.stringify(e);
    }
  }

  async editProductos(name: string, id: number): Promise<string> {
    try {
      await this.db.execute(
        `UPDATE ${this.tables.productos} SET name = '${name}' WHERE id = ${id}`
      );
      return 'actualizar producto';
    } catch (e: any) {
      if (e.message && e.message.includes('UNIQUE constraint')) {
        return 'producto ya existe';
      }
      return 'error al actualizar producto' + JSON.stringify(e);
    }
  }

  async addClientes(name: string, telefono: number, ci: number, direccion: string): Promise<string> {
    try {
      await this.db.execute(
        `INSERT INTO ${this.tables.clientes} (name, telefono, ci, direccion) VALUES ('${name}',${telefono},
        ${ci}, '${direccion}')`
      );
      return 'Cliente Creado';
    } catch (e: any) {
      if (e.message && e.message.includes('UNIQUE constraint')) {
        return 'cliente ya existe';
      }
      return 'error al crear cliente' + JSON.stringify(e);
    }
  }

  async importarClientes(name: string, telefono: number): Promise<void> {
    try {
      await this.db.execute(
        `INSERT INTO ${this.tables.clientes} (name, telefono)
        SELECT '${name}', ${telefono}
        WHERE NOT EXISTS(SELECT 1 FROM clientes WHERE telefono = ${telefono})`
      );
    } catch (e) {
      console.error('error al importar contacto', e);
    }
  }

  async getClientes(): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.tables.clientes} ORDER BY name ASC`
      );
      return result;
    } catch (e) {
      console.error('error al obtener clientes', e);
      return { values: [] };
    }
  }

  async getClienteDetalles(id: number): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.tables.clientes}
        WHERE id = ${id}`
      );
      return result;
    } catch (e) {
      console.error('error al obtener clientes', e);
      return { values: [] };
    }
  }

  async deleteClientes(id: number): Promise<string> {
    try {
      await this.db.execute(`DELETE FROM ${this.tables.clientes} WHERE id = ${id}`);
      return 'cliente eliminado';
    } catch (e) {
      return 'error al eliminar cliente' + JSON.stringify(e);
    }
  }

  async editClientes(name: string, id: number, telefono: number, ci: number,
                     direccion: string): Promise<string> {
    try {
      await this.db.execute(
        `UPDATE ${this.tables.clientes} SET name = '${name}',
         telefono = ${telefono}, ci = ${ci}, direccion = '${direccion}'
         WHERE id = ${id}`
      );
      return 'actualizar cliente';
    } catch (e: any) {
      if (e.message && e.message.includes('UNIQUE constraint')) {
        return 'cliente ya existe';
      }
      return 'error al actualizar cliente' + JSON.stringify(e);
    }
  }

  async addDeudas(clientesId: number, productosId: number, monto: number, fecha: string, recordar: number,
                  detalles: string, tipopagoId: number): Promise<string> {
    try {
      await this.db.execute(
        `INSERT INTO ${this.tables.deudas} (clientesId, productosId, monto, fecha, estado, recordatorioId,
        detalles, tipoPagoId)
         SELECT '${clientesId}', ${productosId}, ${monto},'${fecha}','TRUE', ${recordar}, '${detalles}', '${tipopagoId}' `
      );
      return 'deuda creada';
    } catch (e) {
      return 'error al crear deuda ' + JSON.stringify(e);
    }
  }

  async getDeudas(): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT deudas.id, deudas.productosId,
        deudas.clientesId,
        deudas.monto as monto,
        clientes.name as clientes,
        productos.name as productos, deudas.fecha as fecha,
        clientes.telefono as telefono,
        recordatorioPagos.recordatorio as recordatorio
        FROM deudas
        JOIN productos ON productos.id = deudas.productosId
        JOIN clientes ON  clientes.id = deudas.clientesid
        JOIN recordatorioPagos ON recordatorioPagos.id = deudas.recordatorioid
        where deudas.estado =='TRUE'
        ORDER BY clientes ASC`
      );
      return result;
    } catch (e) {
      console.error('error al obtener deudas', e);
      return { values: [] };
    }
  }

  async getDeudasCanceladas(): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT historial.idCliente,
        historial.idDeuda AS id,
        historial.montos as monto,
        clientes.name as clientes,
        historial.fechas as fecha
        FROM historial
        JOIN clientes ON  clientes.id = historial.idCliente
        where historial.montos = 0
        ORDER by clientes`
      );
      return result;
    } catch (e) {
      console.error('error al obtener deudas', e);
      return { values: [] };
    }
  }

  async editDeudas(monto: number, id: number, fecha: string, tipopagoId: number): Promise<string> {
    try {
      await this.db.execute(
        `UPDATE ${this.tables.deudas} SET monto = ${monto},
        fecha = '${fecha}', tipoPagoId = ${tipopagoId}
        WHERE id = ${id}`
      );
      return 'deuda actualizada';
    } catch (e) {
      return 'error al actualizar deuda ' + JSON.stringify(e);
    }
  }

  async deudaCancelada(monto: number, id: number, fecha: string, metodoPago: number): Promise<string> {
    try {
      await this.db.execute(
        `UPDATE ${this.tables.deudas} SET monto = 0, estado = 'FALSE',
         fecha = '${fecha}', tipoPagoId = '${metodoPago}'
         WHERE id = ${id} and ${monto} = 0`
      );
      return 'Deuda Cancelada';
    } catch (e) {
      return 'error al cancelar deuda' + JSON.stringify(e);
    }
  }

  async deleteDeudas(id: number): Promise<string> {
    try {
      await this.db.execute(`DELETE FROM ${this.tables.deudas} WHERE id = ${id}`);
      return 'deuda eliminada';
    } catch (e) {
      return 'error al eliminar deuda ' + JSON.stringify(e);
    }
  }

  /*funciones para la tabla historia de deudas*/

  async addHistorialNuevo(clientesId: number, productosId: number, monto: number, fecha: string, detalles: string,
                          tipoPagoId: number): Promise<void> {
    try {
      await this.db.execute(
        `INSERT INTO ${this.tables.historial} (idCliente, idProducto, idDeuda, montos, fechas,estado, detalles,
        tipoPagoId)
         VALUES ('${clientesId}', ${productosId},(SELECT MAX(id) AS id from deudas), ${monto},'${fecha}','TRUE',
         '${detalles}', '${tipoPagoId}')`
      );
    } catch (e) {
      console.error('error al crear historial', e);
    }
  }

  async getHistorial(): Promise<DBSQLiteValues> {
    try {
      console.log('DatabaseService.getHistorial - Ejecutando consulta');
      const result = await this.db.query(
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
        ORDER BY clientes ASC`
      );
      console.log('DatabaseService.getHistorial - Resultado OK, registros:', result.values?.length || 0);
      return result;
    } catch (e) {
      console.error('DatabaseService.getHistorial - ERROR:', e);
      console.error('DatabaseService.getHistorial - Detalles del error:', JSON.stringify(e));
      return { values: [] };
    }
  }

  async getHistorialByDeuda(idDeuda: number): Promise<DBSQLiteValues> {
    try {
      console.log('DatabaseService.getHistorialByDeuda - Ejecutando consulta para deuda:', idDeuda);
      const result = await this.db.query(
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
        WHERE historial.idDeuda = ${idDeuda}
        ORDER BY historial.id ASC`
      );
      console.log('DatabaseService.getHistorialByDeuda - Resultado OK, registros:', result.values?.length || 0);
      return result;
    } catch (e) {
      console.error('DatabaseService.getHistorialByDeuda - ERROR:', e);
      console.error('DatabaseService.getHistorialByDeuda - Detalles del error:', JSON.stringify(e));
      return { values: [] };
    }
  }

  async addHistorial(clientesId: number, productosId: number, idDeuda: number, monto: number,
                     fecha: string, detalles: string, tipoPagoId: number): Promise<void> {
    try {
      await this.db.execute(
        `INSERT INTO ${this.tables.historial} (idCliente, idProducto, idDeuda, montos, fechas,
         estado,detalles, tipoPagoId )
         VALUES ('${clientesId}', ${productosId},${idDeuda}, ${monto},'${fecha}',
         'TRUE', '${detalles}', '${tipoPagoId}')`
      );
    } catch (e) {
      console.error('error al crear historial', e);
    }
  }

  async getLastMonto(idDeuda: number): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT montos AS monto
        from historial
        WHERE idDeuda = ${idDeuda} AND
        id = (SELECT max(id)
        from historial
        WHERE idDeuda = ${idDeuda}); `
      );
      return result;
    } catch (e) {
      console.error('error al obtener ultimo monto', e);
      return { values: [] };
    }
  }

  async getLastDeudaId(idDeuda: number): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT id AS id
        from historial
        WHERE idDeuda = ${idDeuda} AND
        id = (SELECT max(id)
        from historial
        WHERE idDeuda = ${idDeuda}); `
      );
      return result;
    } catch (e) {
      console.error('error al obtener ultimo id', e);
      return { values: [] };
    }
  }

  async getFirstDeudaId(idDeuda: number): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT id AS id
        from historial
        WHERE idDeuda = ${idDeuda} AND
        id = (SELECT min(id)
        from historial
        WHERE idDeuda = ${idDeuda}); `
      );
      return result;
    } catch (e) {
      console.error('error al obtener primer id', e);
      return { values: [] };
    }
  }

  async existenciaDeuda(id: number): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT COUNT(*) as cantDeudas
        from historial
        WHERE idCliente = ${id}`
      );
      return result;
    } catch (e) {
      console.error('error al buscar si existen deudas', e);
      return { values: [] };
    }
  }

  async getRecordatorio(): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT * FROM ${this.tables.recordatorioPagos}`
      );
      return result;
    } catch (e) {
      console.error('error al obtener el recordatorio', e);
      return { values: [] };
    }
  }

  async getMetodoPago(): Promise<DBSQLiteValues> {
    try {
      const result = await this.db.query(
        `SELECT * from ${this.tables.metodoPago}`
      );
      return result;
    } catch (e) {
      console.error('error al obtener el metodo de pago', e);
      return { values: [] };
    }
  }

  async getDeudaTotal(): Promise<DBSQLiteValues> {
    await this.openDatabase();
    try {
      return await this.db.query(
        `
      SELECT
        COUNT(DISTINCT deudas.clientesId) AS total_clientes_con_deuda,
        SUM(deudas.monto) AS total_deudas
      FROM deudas
      WHERE deudas.estado = 'TRUE'
      `
      );
    } catch (e) {
      console.error('error al obtener deuda total', e);
      return { values: [] };
    }
  }

  async openDatabase() {
    if (this.dbReady) {
      return; // ya abierta
    }

    try {
      const ret = await this.sqlite.checkConnectionsConsistency();
      const isConn = (await this.sqlite.isConnection('database', false)).result;

      if (ret.result && isConn) {
        this.db = await this.sqlite.retrieveConnection('database', false);
      } else {
        this.db = await this.sqlite.createConnection('database', false, 'no-encryption', 1, false);
      }

      await this.db.open();
      this.dbReady = true;
      console.log('📂 Base de datos abierta');
    } catch (e) {
      console.error('Error abriendo base de datos:', e);
    }
  }

  // Funciones de Backup y Restauración

  async getDatabaseInfo(): Promise<any> {
    try {
      // Retornar información básica de la BD
      const tables = Object.values(this.tables);
      let totalRecords = 0;

      for (const table of tables) {
        const result = await this.db.query(`SELECT COUNT(*) as count FROM ${table}`);
        if (result && result.values && result.values.length > 0) {
          totalRecords += result.values[0].count;
        }
      }

      return {
        size: totalRecords * 1000, // Estimación aproximada en bytes
        records: totalRecords,
        tables: tables.length
      };
    } catch (error) {
      console.error('Error obteniendo info de BD:', error);
      return null;
    }
  }

  async exportDatabase(): Promise<any> {
    try {
      console.log('Exportando base de datos...');

      const backup: any = {
        version: '1.0',
        fecha: new Date().toISOString(),
        tables: {}
      };

      // Exportar todas las tablas
      for (const [key, tableName] of Object.entries(this.tables)) {
        const result = await this.db.query(`SELECT * FROM ${tableName}`);
        backup.tables[tableName] = result.values || [];
        console.log(`Tabla ${tableName}: ${backup.tables[tableName].length} registros`);
      }

      console.log('Backup creado exitosamente');
      return backup;

    } catch (error) {
      console.error('Error exportando base de datos:', error);
      throw error;
    }
  }

  async importDatabase(backupData: any): Promise<void> {
    try {
      console.log('Importando base de datos...');

      if (!backupData || !backupData.tables) {
        throw new Error('Formato de backup inválido');
      }

      // Limpiar todas las tablas existentes
      for (const tableName of Object.values(this.tables)) {
        await this.db.execute(`DELETE FROM ${tableName}`);
        console.log(`Tabla ${tableName} limpiada`);
      }

      // Importar datos de cada tabla
      for (const [tableName, records] of Object.entries(backupData.tables)) {
        if (!Array.isArray(records) || records.length === 0) {
          console.log(`Tabla ${tableName}: sin datos`);
          continue;
        }

        // Obtener nombres de columnas del primer registro
        const columns = Object.keys(records[0]);
        const columnsStr = columns.join(', ');
        const placeholders = columns.map(() => '?').join(', ');

        // Filtrar registros duplicados basándose en todas las columnas
        const uniqueRecords = [];
        const seen = new Set();

        for (const record of records) {
          const key = JSON.stringify(record);
          if (!seen.has(key)) {
            seen.add(key);
            uniqueRecords.push(record);
          }
        }

        // Insertar cada registro único usando INSERT OR IGNORE para evitar errores de constraint
        for (const record of uniqueRecords) {
          const values = columns.map(col => record[col]);
          try {
            await this.db.run(
              `INSERT OR IGNORE INTO ${tableName} (${columnsStr}) VALUES (${placeholders})`,
              values
            );
          } catch (insertError) {
            console.warn(`Error insertando registro en ${tableName}:`, insertError);
            // Continuar con el siguiente registro
          }
        }

        console.log(`Tabla ${tableName}: ${uniqueRecords.length}/${records.length} registros únicos importados`);
      }

      // Asegurar que los valores por defecto existan
      await this.db.execute(
        `INSERT OR IGNORE INTO ${this.tables.recordatorioPagos} (recordatorio)
        VALUES ('Mensual')`
      );
      await this.db.execute(
        `INSERT OR IGNORE INTO ${this.tables.recordatorioPagos} (recordatorio)
        VALUES ('Semanal')`
      );

      await this.db.execute(
        `INSERT OR IGNORE INTO ${this.tables.metodoPago} (name, abreviatura)
        VALUES ('Efectivo', 'EF')`
      );
      await this.db.execute(
        `INSERT OR IGNORE INTO ${this.tables.metodoPago} (name, abreviatura)
        VALUES ('Transferencia', 'TR')`
      );
      await this.db.execute(
        `INSERT OR IGNORE INTO ${this.tables.metodoPago} (name, abreviatura)
        VALUES ('Tarjeta', 'TA')`
      );

      console.log('Base de datos restaurada exitosamente');

    } catch (error) {
      console.error('Error importando base de datos:', error);
      throw error;
    }
  }
}
