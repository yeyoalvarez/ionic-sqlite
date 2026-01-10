import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Platform, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  nombreProducto = '';
  productos: any = [];
  productosFiltrados: any = [];
  editMode = false;
  editId = 0;
  textoBuscar = '';
  p = 1; // Variable de paginación
  cargando = true;
  mostrarFormulario = false;

  // Ordenamiento
  ordenamiento: 'nombre-asc' | 'nombre-desc' | 'reciente' = 'nombre-asc';

  constructor(
    public database: DatabaseService,
    public platform: Platform,
    public alertController: AlertController,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    console.log('ProductosPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('ProductosPage - ionViewWillEnter - Cargando productos');
    this.getProductos();
  }

  async addProductos() {
    console.log('ProductosPage - addProductos - Modo edición:', this.editMode);

    if (!this.nombreProducto.trim().length) {
      this.mostrarToast('Ingrese el nombre del producto', 'warning');
      return;
    }

    if (this.editMode) {
      try {
        await this.database.editProductos(this.nombreProducto.trim(), this.editId);
        console.log('ProductosPage - Producto actualizado:', this.editId);
        this.limpiarFormulario();
        this.mostrarToast('Producto actualizado exitosamente', 'success');
        this.getProductos();
        this.mostrarFormulario = false;
      } catch (error) {
        console.error('ProductosPage - Error actualizando producto:', error);
        this.mostrarToast('Error al actualizar producto', 'danger');
      }
    } else {
      try {
        await this.database.addProductos(this.nombreProducto.trim());
        console.log('ProductosPage - Producto agregado:', this.nombreProducto);
        this.limpiarFormulario();
        this.mostrarToast('Producto agregado exitosamente', 'success');
        this.getProductos();
        this.mostrarFormulario = false;
      } catch (error) {
        console.error('ProductosPage - Error agregando producto:', error);
        this.mostrarToast('Error al agregar producto', 'danger');
      }
    }
  }

  limpiarFormulario() {
    this.nombreProducto = '';
    this.editMode = false;
    this.editId = 0;
  }

  cancelarEdicion() {
    this.limpiarFormulario();
    this.mostrarFormulario = false;
  }

  getProductos() {
    this.cargando = true;
    console.log('ProductosPage - getProductos - Consultando base de datos');

    this.database.getProductos().then((data) => {
      this.productos = [];

      if (data?.values && data.values.length > 0) {
        console.log('ProductosPage - Total productos obtenidos:', data.values.length);

        // Procesar y precalcular datos de productos
        for (let i = 0; i < data.values.length; i++) {
          const producto = { ...data.values[i] };

          // Precalcular nombre para búsqueda y ordenamiento
          producto.nombreDisplay = producto.name || 'Sin nombre';

          // Precalcular inicial
          producto.inicial = producto.nombreDisplay.charAt(0).toUpperCase();

          // Precalcular texto de búsqueda en minúsculas
          producto.textoBusqueda = producto.nombreDisplay.toLowerCase();

          // Precalcular ID formateado
          producto.idDisplay = `ID: ${producto.id}`;

          this.productos.push(producto);
        }
      }

      console.log('ProductosPage - Productos procesados:', this.productos.length);
      this.aplicarFiltrosYOrdenamiento();
      this.cargando = false;
    }).catch(err => {
      console.error('ProductosPage - Error cargando productos:', err);
      this.productos = [];
      this.productosFiltrados = [];
      this.cargando = false;
    });
  }

  aplicarFiltrosYOrdenamiento() {
    let resultado = [...this.productos];

    // Aplicar filtro de búsqueda usando datos precalculados
    if (this.textoBuscar.trim()) {
      const busqueda = this.textoBuscar.toLowerCase();
      resultado = resultado.filter(p => p.textoBusqueda.includes(busqueda));
    }

    // Aplicar ordenamiento usando datos precalculados
    resultado.sort((a, b) => {
      switch (this.ordenamiento) {
        case 'nombre-asc':
          return a.nombreDisplay.localeCompare(b.nombreDisplay);
        case 'nombre-desc':
          return b.nombreDisplay.localeCompare(a.nombreDisplay);
        case 'reciente':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    this.productosFiltrados = resultado;
    console.log('ProductosPage - Productos filtrados:', this.productosFiltrados.length);
  }

  onBuscarChange() {
    console.log('ProductosPage - Búsqueda:', this.textoBuscar);
    this.p = 1; // Resetear a la primera página al buscar
    this.aplicarFiltrosYOrdenamiento();
  }

  cambiarOrdenamiento(tipo: 'nombre-asc' | 'nombre-desc' | 'reciente') {
    console.log('ProductosPage - Cambiar ordenamiento:', tipo);
    this.ordenamiento = tipo;
    this.aplicarFiltrosYOrdenamiento();
  }

  async deleteProductos(id: number) {
    console.log('ProductosPage - Intentando eliminar producto:', id);

    const confirm = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('ProductosPage - Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: async () => {
            try {
              await this.database.deleteProductos(id);
              console.log('ProductosPage - Producto eliminado exitosamente');
              this.mostrarToast('Producto eliminado exitosamente', 'success');
              this.getProductos();
            } catch (error) {
              console.error('ProductosPage - Error eliminando producto:', error);
              this.mostrarToast('Error al eliminar producto', 'danger');
            }
          }
        }
      ]
    });

    await confirm.present();
  }

  editProductos(producto: any) {
    console.log('ProductosPage - Editando producto:', producto.id);
    this.editMode = true;
    this.nombreProducto = producto.name;
    this.editId = producto.id;
    this.mostrarFormulario = true;
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  // Usar datos precalculados para mejor rendimiento
  getInicialProducto(nombre: string): string {
    return nombre?.charAt(0).toUpperCase() || '?';
  }

  getColorPorIndice(index: number): string {
    const colores = ['primary', 'secondary', 'tertiary', 'success', 'warning'];
    return colores[index % colores.length];
  }

  calcularTotalProductos(): number {
    return this.productosFiltrados.length;
  }

  doRefresh(event: any) {
    console.log('ProductosPage - Refrescando productos');
    this.getProductos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  toggleFormulario() {
    console.log('ProductosPage - Toggle formulario:', !this.mostrarFormulario);
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }
}
