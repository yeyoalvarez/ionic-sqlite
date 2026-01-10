# 📱 Deudapp - Sistema de Gestión de Deudas

<div align="center">

![Ionic](https://img.shields.io/badge/Ionic-7.x-3880FF?style=for-the-badge&logo=ionic)
![Angular](https://img.shields.io/badge/Angular-18.x-DD0031?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Capacitor](https://img.shields.io/badge/Capacitor-6.x-119EFF?style=for-the-badge&logo=capacitor)

**Aplicación móvil Android para gestión integral de deudas y cuentas por cobrar**

</div>

---

## 📖 Descripción

**Deudapp** es una aplicación móvil diseñada para vendedores independientes que necesitan llevar un control detallado de las deudas de sus clientes. La aplicación permite gestionar un historial completo de ventas, pagos semanales o mensuales, y generar reportes en PDF para compartir con los clientes.

### 🎯 Problema que Resuelve

Los vendedores independientes necesitan:
- Llevar un registro confiable de quién les debe y cuánto
- Recordar el historial de pagos de cada cliente
- Generar recibos y comprobantes de manera profesional
- Acceder rápidamente a la información sin conexión a internet

### ✅ Solución

Deudapp proporciona una solución completa y offline que permite:
- ✨ Gestionar clientes y sus deudas activas
- 📊 Ver historial completo de transacciones por cliente
- 💰 Registrar pagos parciales o totales
- 📄 Generar PDFs y capturas para compartir
- 📱 Integración con WhatsApp para contacto rápido
- 🔍 Búsqueda rápida y paginación optimizada

---

## ✨ Características Principales

### 👥 Gestión de Clientes
- **Lista de Clientes**: Búsqueda avanzada con paginación de 50 items
- **Importar Contactos**: Integración con contactos del dispositivo
- **Información Completa**: CI, dirección, teléfono y avatar personalizado
- **Acceso Directo**: Llamadas y WhatsApp con un tap
- **Avatares Dinámicos**: Iniciales con 5 variantes de color

### 💰 Gestión de Deudas

#### Deudas Activas
- Listado de todas las cuentas pendientes por cobrar
- Vista rápida de cliente, producto y monto actual
- Filtrado y búsqueda instantánea
- Navegación directa a detalles e historial

#### Deudas Canceladas
- Historial completo de deudas saldadas
- Fecha de cancelación visible
- Archivo histórico para consultas

#### Resumen Total
- **Dashboard con estadísticas clave**:
  - Total de clientes con deuda
  - Monto total adeudado (en Guaraníes)
  - Promedio de deuda por cliente
- Cards visuales con iconos y gradientes
- Exportación a PDF disponible

### 📊 Historial de Transacciones
- **Timeline Visual**: Línea de tiempo con iconos y colores
- **Registro Detallado**: Cada pago o nueva venta con:
  - Fecha de transacción
  - Método de pago utilizado
  - Monto (aumento o disminución)
  - Saldo resultante
  - Notas opcionales
- **Cálculo Automático**: Diferencias y totales calculados en tiempo real

### 📄 Exportación y Compartir
- **Generación de PDF**: Documento completo con historial
- **Captura de Boleta**: Screenshot en formato recibo
- **Compartir**: Via WhatsApp, Email, o cualquier app nativa
- **Formato Profesional**: Diseño listo para imprimir

### 📦 Gestión de Productos
- Catálogo de productos/servicios vendidos
- Asociación con deudas específicas
- Búsqueda y filtrado rápido

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Ionic Framework** | 7.x | Framework móvil híbrido |
| **Angular** | 18.x | Framework web principal |
| **TypeScript** | 5.x | Lenguaje de programación |
| **SCSS** | - | Estilos y diseño |

### Base de Datos
- **@capacitor-community/sqlite**: Base de datos SQLite local
- **Persistencia Offline**: 100% funcional sin internet

### Plugins Nativos (Capacitor)
- `@capacitor-community/contacts` - Acceso a contactos del dispositivo
- `@capacitor/share` - Compartir archivos nativamente
- `@capacitor/filesystem` - Sistema de archivos local

### Librerías
- `ngx-pagination` - Paginación de listas
- `moment.js` - Manejo y formato de fechas
- `jsPDF` - Generación de documentos PDF
- `html2canvas` - Captura de pantalla
- `ionic-selectable` - Selectores avanzados

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **pnpm** - Gestor de paquetes: `npm install -g pnpm`
- **Ionic CLI** (v7 o superior): `npm install -g @ionic/cli`
- **Android Studio** - Para compilación Android

---

## 🚀 Instalación y Ejecución

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/ionic-sqlite.git
cd ionic-sqlite
```

### 2. Instalar Dependencias
```bash
pnpm install
```

### 3. Ejecutar en Modo Desarrollo
```bash
ionic serve
```
La aplicación se abrirá en `http://localhost:8100`

### 4. Compilar para Android

**Opción A: Usando el script predefinido**
```bash
pnpm run build:android
```

**Opción B: Paso a paso**
```bash
# Compilar con producción
pnpm run build:prod

# Sincronizar con Capacitor
ionic cap sync android

# Abrir en Android Studio
ionic cap open android
```

Desde Android Studio:
1. Conecta tu dispositivo Android o inicia un emulador
2. Click en "Run" (▶️) para instalar la app

---

## 📱 Estructura del Proyecto

```
ionic-sqlite/
├── src/
│   ├── app/
│   │   ├── clientes/                    # Gestión de clientes
│   │   │   ├── clientes.page.ts
│   │   │   ├── clientes.page.html
│   │   │   └── clientes.page.scss
│   │   ├── clientes-detalles/          # Vista detallada de cliente
│   │   ├── contactos/                   # Importación de contactos
│   │   ├── productos/                   # Catálogo de productos
│   │   ├── deudas/                      # Nueva deuda
│   │   ├── deudas-clientes/            # Lista de deudas por cliente
│   │   ├── deudas-detalles/            # Detalle con historial
│   │   ├── deudas-canceladas/          # Historial de canceladas
│   │   ├── deudas-canceladas-detalles/
│   │   ├── deudas-total/               # Dashboard resumen
│   │   ├── deudas-cobrar/              # Próximas a cobrar
│   │   ├── database.service.ts         # Servicio SQLite
│   │   ├── app-routing.module.ts
│   │   └── app.component.ts
│   ├── assets/                          # Recursos estáticos
│   ├── theme/                           # Variables de tema
│   └── index.html
├── android/                             # Proyecto Android nativo
├── capacitor.config.ts                  # Configuración Capacitor
├── package.json
├── angular.json
└── README.md
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores
```scss
--ion-color-primary: #3880ff;    // Azul - Navegación principal
--ion-color-success: #2dd36f;    // Verde - Deudas canceladas
--ion-color-warning: #ffc409;    // Amarillo - Alertas y resumen
--ion-color-danger: #eb445a;     // Rojo - Deudas activas
```

### Componentes Modernos
- ✨ **Skeleton Loaders**: Placeholders animados durante la carga
- 🎭 **Animaciones CSS**: fadeIn, slideDown, slideInRight, pulse
- 🎨 **Gradientes**: Headers con gradientes lineales
- 🔵 **Avatares**: 5 variantes de color (primary, success, secondary, tertiary, medium)
- 📱 **Responsive**: Diseño adaptable móvil/tablet/desktop
- 🌊 **Smooth Transitions**: Transiciones suaves en hover y click

### Características UX
- **Empty States**: Mensajes claros cuando no hay datos
- **Loading States**: Indicadores de carga consistentes
- **Error Handling**: Manejo de errores con console.log detallado
- **Optimistic UI**: Feedback inmediato en acciones del usuario

---

## 💾 Modelo de Base de Datos

### Estructura SQL

```sql
-- Tabla de Clientes
CREATE TABLE clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  telefono TEXT,
  ci INTEGER,
  direccion TEXT
);

-- Tabla de Productos
CREATE TABLE productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Tabla de Deudas
CREATE TABLE deudas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idCliente INTEGER,
  idProducto INTEGER,
  montos REAL,
  fecha TEXT,
  estado INTEGER,  -- 0: Cancelada, 1: Activa
  FOREIGN KEY (idCliente) REFERENCES clientes(id),
  FOREIGN KEY (idProducto) REFERENCES productos(id)
);

-- Tabla de Historial
CREATE TABLE historial (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idCliente INTEGER,
  idProducto INTEGER,
  idDeuda INTEGER,
  montos REAL,
  fechas TEXT,
  detalles TEXT,
  tipoPagoId INTEGER,
  FOREIGN KEY (idDeuda) REFERENCES deudas(id),
  FOREIGN KEY (tipoPagoId) REFERENCES metodopago(id)
);

-- Tabla de Métodos de Pago
CREATE TABLE metodopago (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
```

### Relaciones
```
clientes (1) -----> (N) deudas
productos (1) -----> (N) deudas
deudas (1) -----> (N) historial
metodopago (1) -----> (N) historial
```

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm start              # Inicia servidor de desarrollo

# Compilación
pnpm run build          # Build básico
pnpm run build:prod     # Build optimizado para producción

# Android
pnpm run build:android  # Build + sync Android completo

# Testing
pnpm test               # Ejecuta tests unitarios
pnpm run lint           # Verifica código con ESLint
```

---

## 🔧 Configuración Avanzada

### Memoria de Node.js
El proyecto está configurado para usar más memoria en builds grandes:

**`.npmrc`**
```ini
node-options=--max-old-space-size=8192
```

### Capacitor Config
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Deudapp',
  webDir: 'www',
  bundledWebRuntime: false
};

export default config;
```

---

## 💡 Funcionalidades Técnicas Destacadas

### 1. Precalculación de Datos
Optimización del renderizado calculando datos una sola vez:
```typescript
// En lugar de calcular en el HTML...
deuda.nombreDisplay = deuda.clientes || 'Sin nombre';
deuda.inicial = deuda.nombreDisplay.charAt(0).toUpperCase();
deuda.textoBusqueda = `${nombreDisplay} ${telefono}`.toLowerCase();
```

### 2. Paginación Consistente
Todas las listas usan 50 items por página:
```html
<ion-card *ngFor="let item of items | paginate: { itemsPerPage: 50, currentPage: p }">
```

### 3. Búsqueda Optimizada
Búsqueda en texto precalculado:
```typescript
buscarTexto(item: any): boolean {
  if (!this.textoBuscar) return true;
  return item.textoBusqueda.includes(this.textoBuscar.toLowerCase());
}
```

### 4. Skeleton Loaders
Mejor percepción de velocidad:
```html
<div *ngIf="cargando" class="skeleton-container">
  <ion-skeleton-text animated></ion-skeleton-text>
</div>
```

---

## 🚧 Roadmap

### ✅ Implementado
- [x] Gestión completa de clientes
- [x] Gestión de deudas activas y canceladas
- [x] Historial detallado de transacciones
- [x] Generación de PDF
- [x] Captura de screenshots
- [x] Integración con WhatsApp
- [x] Búsqueda y paginación optimizada
- [x] Diseño moderno y responsive

### 🔜 Próximas Mejoras
- [ ] Impresión Bluetooth en impresoras térmicas
- [ ] Notificaciones de recordatorio de cobro
- [ ] Backup automático en la nube
- [ ] Gráficos y estadísticas avanzadas
- [ ] Modo oscuro
- [ ] Múltiples vendedores/usuarios
- [ ] Exportación a Excel
- [ ] Widget de Android

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si quieres mejorar Deudapp:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/MejoraNombre`)
3. **Commit** tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/MejoraNombre`)
5. Abre un **Pull Request**

### Guías de Contribución
- Usa nombres de variables y funciones en español
- Sigue el estilo de código existente
- Agrega console.logs descriptivos
- Documenta funciones complejas
- Prueba en dispositivo Android real

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

---

## 🙏 Agradecimientos

- [Ionic Framework](https://ionicframework.com/) - Framework móvil
- [Angular](https://angular.io/) - Framework web
- [Capacitor](https://capacitorjs.com/) - Runtime nativo
- Comunidad de desarrolladores open source

---

## 📞 Soporte

¿Tienes dudas o problemas?
- 🐛 [Reportar un bug](https://github.com/tu-usuario/ionic-sqlite/issues)
- 💡 [Sugerir una mejora](https://github.com/tu-usuario/ionic-sqlite/issues)
- 📧 Contacto directo: tu-email@ejemplo.com

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub! ⭐**

*Hecho con ❤️ para vendedores independientes*

</div>
