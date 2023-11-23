import { Component, EventEmitter, Output } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Usuario } from './usuario';
import { RegistroRequest } from './registro-request';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginServiceService } from '../login-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMessage: string | null = null;

  isRightPanelActive: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private loginService: LoginServiceService,
    private cdr: ChangeDetectorRef ) {}

  onSignInClick(): void {
    this.isRightPanelActive = false;
    this.onSubmit();
  }

  onSignUpClick(): void {
    this.isRightPanelActive = true;
    this.onSubmit();
  }

  @Output() status: EventEmitter<boolean> = new EventEmitter<boolean>();

  usuario : Usuario = new Usuario(); 
  registroRequest : RegistroRequest = new RegistroRequest();
  
  onSubmit(): void {
    // You can handle the login logic here
    if (this.isRightPanelActive) {
        this.registrar();
    } else {
      this.login();
     
    }
  }
  login(){
    const correo = this.usuario.email; 
    const password = this.usuario.password;  

    this.loginService.login(correo, password).subscribe(
      (  respuesta: any) => {
        console.log('Login successful');
        console.log(respuesta);
        console.log(respuesta.roles);
        console.log(respuesta.idUsuario);
        this.authService.guardarDatosUsuario(respuesta.roles, respuesta.idUsuario);
        this.authService.setUserRole(respuesta.roles);
        this.status.emit(true); // Emit true when login is successful
        this.router.navigate(['/menu']); // Navigate to MenuComponent after
        this.errorMessage = '';
        this.cdr.detectChanges(); 
      },
      (   error: any) => {
        console.log('Invalid credentials. Please try again.');
        
        this.status.emit(false); // Emit false when login fails

        const invalido = document.createElement('P') as HTMLParagraphElement;
        invalido.textContent = 'Correo o Contraseña inválido';
        invalido.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center');

        const container = document.getElementById('yourContainerId');

        if (container) {
          container.appendChild(error);
        }
      }
    );
  }
  registrar(){
    const nombre = this.usuario.nombre;
    const apellido = this.usuario.apellido;
    const correo = this.usuario.email;
    const password = this.usuario.password;
    const rol = 'Cliente'
    const edad = this.usuario.edad;
    console.log(nombre);
    console.log(apellido);
    console.log(correo);
    console.log(password);
    console.log(rol);
    console.log(edad);
    this.loginService.registrar(nombre, apellido, correo, password, rol, edad).subscribe(
      (respuesta : any) => {
        this.authService.guardarDatosUsuario(respuesta.roles, respuesta.idUsuario);
        this.authService.setUserRole(respuesta.roles);
        this.status.emit(true);
        this.router.navigate(['/menu']);
      },
      (error: any) => {
        console.error('Error en la solicitud de registro:', error);
        
      }
    );
    
    
  }
 
  
}
