import { Component, OnInit } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import { DatabaseService } from '../database.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.page.html',
  styleUrls: ['./contactos.page.scss'],
})
export class ContactosPage implements OnInit {
  textoBuscar = '';
  telefonoParsed = '';
  contacts: any = [];
  contactosFiltrados: any = [];
  p = 1; // Variable de paginación
  cargando = true;
  paisCodigo = '595';

  // Ordenamiento
  ordenamiento: 'nombre-asc' | 'nombre-desc' = 'nombre-asc';

  constructor(
    public database: DatabaseService,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    console.log('ContactosPage - ngOnInit');
  }

  ionViewWillEnter() {
    console.log('ContactosPage - ionViewWillEnter - Solicitando permisos');
    this.getPermissions();
  }

  async getPermissions() {
    this.cargando = true;
    console.log('ContactosPage - getPermissions - Solicitando permisos de contactos');
    try {
      const permission = await Contacts.requestPermissions();
      console.log('ContactosPage - Permisos:', permission.contacts);

      if (permission.contacts === 'granted') {
        this.getContacts();
        return;
      }

      // Intentar obtener contactos de todas formas
      this.getContacts();
    } catch (error) {
      console.error('ContactosPage - Error solicitando permisos:', error);
      this.getContacts();
    }
  }

  async getContacts() {
    this.cargando = true;
    console.log('ContactosPage - getContacts - Obteniendo contactos del dispositivo');

    try {
      const result = await Contacts.getContacts({
        projection: {
          name: true,
          phones: true,
          image: true
        }
      });

      console.log('ContactosPage - Total contactos obtenidos:', result.contacts?.length || 0);
      this.contacts = [];

      if (result.contacts && result.contacts.length > 0) {
        // Procesar y precalcular datos de contactos
        for (let i = 0; i < result.contacts.length; i++) {
          const contacto: any = { ...result.contacts[i] };

          // Precalcular nombre para búsqueda y ordenamiento
          contacto.nombreDisplay = this.getNombreContacto(contacto);

          // Precalcular teléfono
          contacto.telefonoDisplay = this.getTelefonoContacto(contacto);

          // Precalcular si tiene teléfono
          contacto.tieneTelefono = contacto.phones && contacto.phones.length > 0;

          // Precalcular inicial
          contacto.inicial = contacto.nombreDisplay.charAt(0).toUpperCase();

          this.contacts.push(contacto);
        }
      }

      console.log('ContactosPage - Contactos procesados:', this.contacts.length);
      this.aplicarFiltrosYOrdenamiento();
      this.cargando = false;
    } catch (error) {
      console.error('ContactosPage - Error obteniendo contactos:', error);
      this.mostrarToast('Error al obtener contactos', 'danger');
      this.contacts = [];
      this.contactosFiltrados = [];
      this.cargando = false;
    }
  }

  aplicarFiltrosYOrdenamiento() {
    let resultado = [...this.contacts];

    // Aplicar filtro de búsqueda usando los datos precalculados
    if (this.textoBuscar.trim()) {
      const busqueda = this.textoBuscar.toLowerCase();
      resultado = resultado.filter(c =>
        c.nombreDisplay.toLowerCase().includes(busqueda) ||
        c.telefonoDisplay.toLowerCase().includes(busqueda)
      );
    }

    // Aplicar ordenamiento usando los datos precalculados
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

    this.contactosFiltrados = resultado;
    console.log('ContactosPage - Contactos filtrados:', this.contactosFiltrados.length);
  }

  onBuscarChange() {
    console.log('ContactosPage - Búsqueda:', this.textoBuscar);
    this.p = 1; // Resetear a la primera página al buscar
    this.aplicarFiltrosYOrdenamiento();
  }

  cambiarOrdenamiento(tipo: 'nombre-asc' | 'nombre-desc') {
    console.log('ContactosPage - Cambiar ordenamiento:', tipo);
    this.ordenamiento = tipo;
    this.aplicarFiltrosYOrdenamiento();
  }

  insertarContactos(nombre: string, telefono: string): boolean {
    // Limpiar el teléfono de caracteres especiales
    this.telefonoParsed = telefono.replace(/[\s\-\(\)]/g, '');

    console.log(`ContactosPage - Parseando ${telefono} => ${this.telefonoParsed}`);

    // Validar que sea un número válido de Paraguay (9 dígitos)
    const numeroLimpio = Number(this.telefonoParsed.substr(-9, 9));

    if (numeroLimpio >= 911111111 && numeroLimpio <= 999999999) {
      console.log('ContactosPage - Número válido:', numeroLimpio);
      this.database
        .importarClientes(nombre, numeroLimpio)
        .then(() => {
          console.log('ContactosPage - Cliente importado:', nombre);
        })
        .catch(err => {
          console.error('ContactosPage - Error importando cliente:', err);
        });
      return true;
    } else {
      console.log('ContactosPage - Número inválido:', numeroLimpio);
      return false;
    }
  }

  async importarContactos() {
    const loading = await this.loadingController.create({
      message: 'Importando contactos...',
      spinner: 'crescent',
      cssClass: 'custom-loading'
    });
    await loading.present();

    console.log('ContactosPage - Iniciando importación de', this.contacts.length, 'contactos');
    let importados = 0;
    let omitidos = 0;

    for (let i = 0; i < this.contacts.length; i++) {
      const contacto = this.contacts[i];

      if (contacto.tieneTelefono) {
        const exito = this.insertarContactos(
          contacto.nombreDisplay,
          contacto.phones[0].number
        );

        if (exito) {
          importados++;
        } else {
          omitidos++;
        }
      } else {
        omitidos++;
      }
    }

    await loading.dismiss();

    console.log('ContactosPage - Importación completada:', importados, 'importados,', omitidos, 'omitidos');
    this.mostrarToast(
      `${importados} contactos importados exitosamente${omitidos > 0 ? ` (${omitidos} omitidos)` : ''}`,
      'success'
    );
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
  getInicialContacto(contacto: any): string {
    return contacto.inicial || '?';
  }

  getColorPorIndice(index: number): string {
    const colores = ['primary', 'secondary', 'tertiary', 'success', 'warning'];
    return colores[index % colores.length];
  }

  getNombreContacto(contacto: any): string {
    return contacto.name?.display || contacto.name?.given || 'Sin nombre';
  }

  getTelefonoContacto(contacto: any): string {
    if (contacto.phones && contacto.phones.length > 0) {
      return contacto.phones[0].number;
    }
    return 'Sin teléfono';
  }

  abrirWhatsApp(telefono: string) {
    const tel = telefono.replace(/\D/g, '');
    const numeroCompleto = `${this.paisCodigo}${tel.substr(-9)}`;
    const url = `https://api.whatsapp.com/send?phone=${numeroCompleto}`;
    console.log('ContactosPage - Abriendo WhatsApp:', numeroCompleto);
    window.open(url, '_blank');
  }

  llamarTelefono(telefono: string) {
    const tel = telefono.replace(/\D/g, '');
    const numeroCompleto = `${this.paisCodigo}${tel.substr(-9)}`;
    console.log('ContactosPage - Llamando a:', numeroCompleto);
    window.open(`tel:${numeroCompleto}`, '_self');
  }

  calcularTotalContactos(): number {
    return this.contactosFiltrados.length;
  }

  calcularContactosConTelefono(): number {
    return this.contactosFiltrados.filter(c => c.tieneTelefono).length;
  }

  doRefresh(event: any) {
    console.log('ContactosPage - Refrescando contactos');
    this.getContacts();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}

