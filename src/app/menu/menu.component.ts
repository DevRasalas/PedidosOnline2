import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/app/producto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProductoService } from '../producto.service';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Productos } from '../productos';
import { OrdenesService } from './ordenes.service';
import { OrdenConProducto } from '../orden-con-producto';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css', './menu.normalize.css', './menu.skeleton.css']
})
export class MenuComponent implements OnInit {
  
  constructor(
    public sanitizer: DomSanitizer,
    public productoServicio: ProductoService,
    private router: Router,
    private authService: AuthService,
    private ordenesService: OrdenesService ) {}

///Implementamos Toma de Ordenes
enviarOrden() {
    const ordenConProducto: OrdenConProducto = {
      orden: {
        idUsuario: this.authService.obtenerIdUsuario() || '0',
        direccion: "Zeballos-Kue",
        montoTotal: this.montoTotalProd
      },
      productos: this.productos2
    };

    this.ordenesService.crearOrdenConProducto(ordenConProducto).subscribe(
      respuesta => {
        console.log('Orden enviada correctamente', respuesta);
        // Manejar la respuesta según sea necesario
      },
      error => {
        console.error('Error al enviar la orden', error);
        // Manejar el error según sea necesario
      }
    );
}



eliminarProducto(productos: Productos) {
  const index = this.productos2.indexOf(productos);
  if (index !== -1) {
    this.productos2.splice(index, 1);
  }
}

//Finaliza Toma de Ordenes
  mostrarHistorialPedidos: boolean = false;  

  imagenUrl: SafeResourceUrl | null;
  direccionIngresada: string;
  userRole: string = '';
  carrito: any;
  contenedorCarrito: any;
  vaciarCarritoBtn: any;
  confirmarPedidoBtn: any;
  listarCombos: any;
  articulosCarrito: any[] = [];
  productos: Producto[] = [];
  producto: Producto = new Producto();
  contador: number = 0;
  imagenes: SafeResourceUrl[] = [];
  file : any;
  url ?: string;
  productos2 : Productos [] = [];
  montoTotalProd : number = 0;
  toggleVista(): void {
    this.mostrarHistorialPedidos = !this.mostrarHistorialPedidos;
    // Aquí puedes realizar otras acciones necesarias al cambiar la vista
  }

  @ViewChild('miFormulario') miFormulario: NgForm;
  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    console.log('User Role:', this.userRole);
    
    this.carrito = document.querySelector('#carrito');
    this.contenedorCarrito = document.querySelector('#lista-carrito tbody');
    this.vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    this.listarCombos = document.querySelector('#lista-combos');
    this.confirmarPedidoBtn = document.querySelector('#confirmar-pedido');

    this.cargarEventListeners();
    this.obtenerProductos();
  }

  onCerrarSesionClick() {
    const isConfirmed = window.confirm('¿Está seguro de cerrar sesión?');

    // If the user confirms, navigate to the login page
    if (isConfirmed) {
      this.authService.limpiarDatosUsuario();
      this.router.navigate(['/login']);
    }
  }

  /*
    Aqui creamos la funcion onSubmit
  */
  
    onSubmit(){
      this.subir().then(() => {
        this.obtenerProductos();
        this.miFormulario.resetForm();
      })
      .catch((error) => {
        console.error('Error al enviar el formulario: ' + error);
      });
    }
    fileSeleccionada(event: any){
      this.file = event.target.files[0];
      
    }
    subir(){
     return new Promise((resolve, reject) => {
      const formData = new FormData;
      formData.append('file',this.file);
      formData.append('nombre', JSON.stringify(this.producto.nombreProducto));
      formData.append('precio', JSON.stringify(this.producto.precioProducto));
    console.log(this.file +" - "+ this.producto.nombreProducto +" - "+ this.producto.precioProducto);
      this.productoServicio.upleadFile(formData).subscribe(response =>{
        console.log('response', response);
        this.url = response.url;
      })
      });
      
    }
  obtenerProductos(){
    this.productoServicio.mostrarProductos().subscribe(
      (datos => {
        this.productos = datos;
      })
    );
  }
  cargarEventListeners() {
    if (this.listarCombos) {
      this.listarCombos.addEventListener('click', this.agregarCombos.bind(this));
    }
  
    if (this.carrito) {
      this.carrito.addEventListener('click', (e: Event) => {
        this.eliminarCombo(e);
      });
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      this.articulosCarrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  
      this.carritoHTML();
    });

    if (this.confirmarPedidoBtn) {
      this.confirmarPedidoBtn.addEventListener('click', this.confirmarPedido.bind(this));
    }
  
    if (this.vaciarCarritoBtn) {
      this.vaciarCarritoBtn.addEventListener('click', () => {
        this.articulosCarrito = [];
        this.limpiarHTML();
        this.carritoHTML();
      });
    }
  }
  
  agregarCombos(e: Event) {
    e.preventDefault();
    console.log("Se cargo correctamente");
    if ((e.target as HTMLElement).classList.contains('agregar-carrito')) {
      const comboSeleccionado = (e.target as HTMLElement).parentElement?.parentElement;
      if (comboSeleccionado) {
        this.leerDatosCombo(comboSeleccionado);
      }
    }
  }

  confirmarPedido() {
    const header = document.querySelector('#header');
  
    if (header) {
      const mensaje = document.createElement('div');
      mensaje.classList.add('form-container');
      mensaje.style.textAlign = 'center';
      mensaje.style.padding = '10px';
      mensaje.style.marginTop = '10px';
      mensaje.style.borderRadius = '5px';
  
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Listo';
      submitButton.style.padding = '10px';
      submitButton.style.borderRadius = '5px';
      submitButton.style.backgroundColor = '#4CAF50';
      submitButton.style.color = 'white';
      submitButton.style.border = 'none';
      submitButton.style.cursor = 'pointer';
  
      if (this.articulosCarrito.length > 0) {
        // Clear any existing message
        while (header.firstChild) {
          header.removeChild(header.firstChild);
        }
  
        const form = document.createElement('form');
        form.style.backgroundColor = 'white';
        form.style.padding = '20px';
        form.style.borderRadius = '5px';
        form.style.width = '300px';
        form.style.margin = 'auto';
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '10px';
  
        const labelStyle = 'font-size: 1.2rem !important; color: rgb(43, 109, 253) !important; font-family: fantasy !important; font-weight: bold !important; margin-bottom: 5px !important;';
        const inputStyle = 'padding: 8px !important; border-radius: 5px !important; border: 1px solid #ddd !important;';
  
        form.innerHTML = `
          <label for="address" style="${labelStyle}">Ingrese su dirección:</label>
          <input type="text" id="address" style="${inputStyle}" name="address" >
        `;
           
        submitButton.addEventListener('click', () => {
          this.enviarOrden();
          this.articulosCarrito = [];
          this.limpiarHTML();
          this.carritoHTML();
          form.style.display = 'none';
          const row = document.createElement('div');
          row.classList.add('row');
          const headerContent = document.querySelector('#header-content');
          if (headerContent) {
            headerContent.appendChild(row);
            mensaje.textContent = '¡¡Gracias por su pedido!!';
            mensaje.style.color = 'white';
            mensaje.style.backgroundColor = 'green';
            localStorage.setItem('pedidoRealizado', 'true');
          }
        });
  
        form.appendChild(submitButton);
        mensaje.style.color = 'black';
        mensaje.style.backgroundColor = 'white';
  
        header.appendChild(mensaje);
        header.appendChild(form);
      } else {
        mensaje.textContent = 'El carrito está vacío';
        mensaje.style.color = 'black';
        mensaje.style.backgroundColor = 'yellow';
        header.appendChild(mensaje);
      }
  
      const pedidoRealizado = localStorage.getItem('pedidoRealizado');
      if (pedidoRealizado === 'true') {
        const row = document.createElement('div');
        row.classList.add('row');
        const headerContent = document.querySelector('#header-content');
        if (headerContent) {
          headerContent.appendChild(row);
          mensaje.textContent = '¡¡Gracias por su pedido!!';
          mensaje.style.color = 'white';
          mensaje.style.backgroundColor = 'green';
        }
      }
  
      // Remove the message after 3 seconds
      setTimeout(() => {
        header.removeChild(mensaje);
        localStorage.removeItem('pedidoRealizado');
      }, 3000);
    }
  }
  
  
  
  eliminarCombo(e: Event) {
    e.preventDefault();
    if ((e.target as HTMLElement).classList.contains('borrar-combo')) {
      const comboId = (e.target as HTMLElement).getAttribute('data-id');
      if (comboId) {
        this.articulosCarrito = this.articulosCarrito.filter((combo) => combo.id !== parseInt(comboId));
        this.carritoHTML();
      }
    }
  }
  
  leerDatosCombo(combo: any) {
    if (combo) {
        const agregarCarritoElement = combo.querySelector('.agregar-carrito');
        console.log("agregarCarritoElement:", agregarCarritoElement);

        if (agregarCarritoElement) {
            const idNormal = parseInt(agregarCarritoElement.getAttribute('id') || "");
            console.log("idNormal:", idNormal);

            const precioElement = combo.querySelector('.precio span');
            const precio = precioElement ? precioElement.textContent : '';

            const existingProduct = this.articulosCarrito.find((product) => product.id === idNormal);
            console.log("existingProduct:", existingProduct);

            if (existingProduct) {
                existingProduct.cantidad++;
            } else {
                const infoCombo = {
                    imagen: combo.querySelector('img')?.src,
                    titulo: combo.querySelector('h4')?.textContent,
                    precio: precio,
                    id: idNormal,
                    cantidad: 1
                };
                const productosCarro ={
                    idProducto: idNormal,
                    cantidad: 1
                };
                this.productos2.push(productosCarro);
                this.articulosCarrito.push(infoCombo);
            }

            this.carritoHTML();
        } else {
            console.error("Agregar carrito element not found.");
        }
    } else {
        console.error("Combo element not found.");
    }
}

  
  // carritoHTML() {
  //   this.limpiarHTML();
  
  //   this.articulosCarrito.forEach((combo) => {
  //     const { imagen, titulo, precio, cantidad, id } = combo;
  //     const row = document.createElement('tr');
  //     if (imagen && titulo && precio) {
  //       row.innerHTML = `
  //         <td>
  //             <img src="${imagen}" width="100">
  //         </td>
  //         <td>${titulo}</td>
  //         <td>${precio}</td>
  //         <td>${cantidad}</td>
  //         <td>
  //             <a href="#" class="borrar-combo" data-id="${id}"> X </a>
  //         </td>
  //       `;
  
  //       this.contenedorCarrito?.appendChild(row);
  //     }
  //   });
  
  //   this.sincronizarStorage();
  // }

  carritoHTML() {
    this.limpiarHTML();
  
    let totalPrice = 0;
    this.montoTotalProd = totalPrice;
    this.articulosCarrito.forEach((combo) => {
      const { imagen, titulo, precio, cantidad, id } = combo;
      const row = document.createElement('tr');
      if (imagen && titulo && precio) {
        const precioNumerico = parseInt(precio.replace('$', '', ' ','Gs')) || 0;
        const totalComboPrice = precioNumerico * cantidad;
        totalPrice += totalComboPrice;
        row.innerHTML = `
          <td>
              <img src="${imagen}" width="100">
          </td>
          <td>${titulo}</td>
          <td>${precio}</td>
          <td>${cantidad}</td>
          <td>
              <a href="#" class="borrar-combo" data-id="${id}"> X </a>
          </td>
        `;
  
        this.contenedorCarrito?.appendChild(row);
      }
    });

    const saltoLine = document.createElement('br');
    this.contenedorCarrito?.appendChild(saltoLine);
  
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td colspan="2"></td>
      <td>Total a Pagar:</td>
      <td class="total-price" style="font-weight: bold; font-size: 1.4rem;">${totalPrice} Gs</td>
      <td></td>
    `;
    this.contenedorCarrito?.appendChild(totalRow);
  
    this.sincronizarStorage();
  }
  
  
  sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.articulosCarrito));
  }
  
  limpiarHTML() {
    while (this.contenedorCarrito && this.contenedorCarrito.firstChild) {
      this.contenedorCarrito.removeChild(this.contenedorCarrito.firstChild);
    }
  }
  }
  
  