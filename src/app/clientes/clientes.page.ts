import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  clienteNombre = '';
  clientes: any = [];
  clientesFiltrados: any = [];
  telefonos: any = [];
  telefono = 9;
  ci = 0;
  direccion = '';
  paisCodigo = '595';
  idExisteDeuda = 0;
  idExDeuda: any = [];

  editMode = false;
  editId = 0;
  selectedItem: any;
  textoBuscar = '';
  p = 1; // Variable de paginación
  cargando = true;
  mostrarFormulario = false;

  // Ordenamiento
  ordenamiento: 'nombre-asc' | 'nombre-desc' | 'deudas-desc' = 'nombre-asc';

  constructor(
    public database: DatabaseService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ClientesPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('ClientesPage - ionViewWillEnter - Cargando clientes');
    this.getClientes();
  }

  async addClientes() {
    console.log('ClientesPage - addClientes - Modo edición:', this.editMode);

    if (!this.clienteNombre.trim()) {
      this.mostrarToast('Ingrese el nombre del cliente', 'warning');
      return;
    }
    if (this.telefono === 9 || !this.telefono) {
      this.mostrarToast('Ingrese un número de teléfono válido', 'warning');
      return;
    }

    if (this.editMode) {
      try {
        await this.database.editClientes(
          this.clienteNombre.trim(),
          this.editId,
          this.telefono,
          this.ci,
          this.direccion.trim()
        );
        console.log('ClientesPage - Cliente actualizado:', this.editId);
        this.limpiarFormulario();
        this.mostrarToast('Cliente actualizado exitosamente', 'success');
        this.getClientes();
        this.mostrarFormulario = false;
      } catch (error) {
        console.error('ClientesPage - Error actualizando cliente:', error);
        this.mostrarToast('Error al actualizar cliente', 'danger');
      }
    } else {
      try {
        await this.database.addClientes(
          this.clienteNombre.trim(),
          this.telefono,
          this.ci,
          this.direccion.trim()
        );
        console.log('ClientesPage - Cliente agregado:', this.clienteNombre);
        this.limpiarFormulario();
        this.mostrarToast('Cliente agregado exitosamente', 'success');
        this.getClientes();
        this.mostrarFormulario = false;
      } catch (error) {
        console.error('ClientesPage - Error agregando cliente:', error);
        this.mostrarToast('Error al agregar cliente', 'danger');
      }
    }
  }

  limpiarFormulario() {
    this.clienteNombre = '';
    this.telefono = 9;
    this.editMode = false;
    this.editId = 0;
    this.ci = 0;
    this.direccion = '';
  }

  cancelarEdicion() {
    this.limpiarFormulario();
    this.mostrarFormulario = false;
  }

  getClientes() {
    this.cargando = true;
    console.log('ClientesPage - getClientes - Consultando base de datos');

    this.database.getClientes().then((data) => {
      this.clientes = [];

      if (data?.values && data.values.length > 0) {
        console.log('ClientesPage - Total clientes obtenidos:', data.values.length);

        // Procesar y precalcular datos de clientes
        for (let i = 0; i < data.values.length; i++) {
          const cliente = { ...data.values[i] };

          // Precalcular nombre para búsqueda y ordenamiento
          cliente.nombreDisplay = cliente.name || 'Sin nombre';

          // Precalcular teléfono formateado
          cliente.telefonoDisplay = cliente.telefono ? `${this.paisCodigo} ${cliente.telefono}` : 'Sin teléfono';

          // Precalcular inicial
          cliente.inicial = cliente.nombreDisplay.charAt(0).toUpperCase();

          // Precalcular si tiene datos opcionales
          cliente.tieneCi = cliente.ci && cliente.ci > 0;
          cliente.tieneDireccion = cliente.direccion && cliente.direccion.trim().length > 0;

          // Precalcular texto de búsqueda combinado
          cliente.textoBusqueda = `${cliente.nombreDisplay} ${cliente.telefono || ''} ${cliente.ci || ''}`.toLowerCase();

          this.clientes.push(cliente);
        }
      }

      console.log('ClientesPage - Clientes procesados:', this.clientes.length);
      this.aplicarFiltrosYOrdenamiento();
      this.cargando = false;
    }).catch(err => {
      console.error('ClientesPage - Error cargando clientes:', err);
      this.clientes = [];
      this.clientesFiltrados = [];
      this.cargando = false;
    });
  }

  aplicarFiltrosYOrdenamiento() {
    let resultado = [...this.clientes];

    // Aplicar filtro de búsqueda usando datos precalculados
    if (this.textoBuscar.trim()) {
      const busqueda = this.textoBuscar.toLowerCase();
      resultado = resultado.filter(c => c.textoBusqueda.includes(busqueda));
    }

    // Aplicar ordenamiento usando datos precalculados
    resultado.sort((a, b) => {
      switch (this.ordenamiento) {
        case 'nombre-asc':
          return a.nombreDisplay.localeCompare(b.nombreDisplay);
        case 'nombre-desc':
          return b.nombreDisplay.localeCompare(a.nombreDisplay);
        default:
          return 0;
      }
    });

    this.clientesFiltrados = resultado;
    console.log('ClientesPage - Clientes filtrados:', this.clientesFiltrados.length);
  }

  onBuscarChange() {
    console.log('ClientesPage - Búsqueda:', this.textoBuscar);
    this.p = 1; // Resetear a la primera página al buscar
    this.aplicarFiltrosYOrdenamiento();
  }

  cambiarOrdenamiento(tipo: 'nombre-asc' | 'nombre-desc' | 'deudas-desc') {
    console.log('ClientesPage - Cambiar ordenamiento:', tipo);
    this.ordenamiento = tipo;
    this.aplicarFiltrosYOrdenamiento();
  }

  async deleteClientes(id: number) {
    console.log('ClientesPage - Intentando eliminar cliente:', id);

    const confirm = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('ClientesPage - Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: async () => {
            try {
              const data = await this.database.existenciaDeuda(Number(id));
              const cantDeudas = data.values[0]?.cantDeudas || 0;

              console.log('ClientesPage - Cliente tiene', cantDeudas, 'deudas');

              if (cantDeudas === 0) {
                await this.database.deleteClientes(id);
                console.log('ClientesPage - Cliente eliminado exitosamente');
                this.mostrarToast('Cliente eliminado exitosamente', 'success');
                this.getClientes();
              } else {
                this.presentAlert();
              }
            } catch (error) {
              console.error('ClientesPage - Error verificando/eliminando cliente:', error);
              this.mostrarToast('Error al eliminar cliente', 'danger');
            }
          }
        }
      ]
    });

    await confirm.present();
  }

  editClientes(cliente: any) {
    console.log('ClientesPage - Editando cliente:', cliente.id);
    this.editMode = true;
    this.clienteNombre = cliente.name;
    this.telefono = cliente.telefono;
    this.ci = cliente.ci || 0;
    this.direccion = cliente.direccion || '';
    this.editId = cliente.id;
    this.mostrarFormulario = true;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'No se puede eliminar',
      message: 'El cliente tiene historial de deudas asociadas',
      buttons: ['OK']
    });
    await alert.present();
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
  getInicialCliente(nombre: string): string {
    return nombre?.charAt(0).toUpperCase() || '?';
  }

  getColorPorIndice(index: number): string {
    const colores = ['primary', 'secondary', 'tertiary', 'success', 'warning'];
    return colores[index % colores.length];
  }

  navegarADetalle(id: number) {
    console.log('ClientesPage - Navegando a detalle:', id);
    this.router.navigate(['/clientes-detalles', id]);
  }

  abrirWhatsApp(telefono: string) {
    const numeroCompleto = `${this.paisCodigo}${telefono}`;
    const url = `https://api.whatsapp.com/send?phone=${numeroCompleto}`;
    console.log('ClientesPage - Abriendo WhatsApp:', numeroCompleto);
    window.open(url, '_blank');
  }

  llamarTelefono(telefono: string) {
    const numeroCompleto = `${this.paisCodigo}${telefono}`;
    console.log('ClientesPage - Llamando a:', numeroCompleto);
    window.open(`tel:${numeroCompleto}`, '_self');
  }

  calcularTotalClientes(): number {
    return this.clientesFiltrados.length;
  }

  calcularClientesConCi(): number {
    return this.clientesFiltrados.filter(c => c.tieneCi).length;
  }

  calcularClientesConDireccion(): number {
    return this.clientesFiltrados.filter(c => c.tieneDireccion).length;
  }

  doRefresh(event: any) {
    console.log('ClientesPage - Refrescando clientes');
    this.getClientes();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  toggleFormulario() {
    console.log('ClientesPage - Toggle formulario:', !this.mostrarFormulario);
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }
}
