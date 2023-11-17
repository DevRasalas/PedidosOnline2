import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: string = '';

  setUserRole(role: string): void {
    this.userRole = role;
  }

  getUserRole(): string {
    return this.userRole;
  }
  // Método para almacenar el rol y la ID del usuario en el localStorage
  guardarDatosUsuario(rol: string, idUsuario: string): void {
    localStorage.setItem('rol', rol);
    localStorage.setItem('idUsuario', idUsuario);
  }

  // Método para obtener el rol del localStorage
  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  // Método para obtener la ID del usuario del localStorage
  obtenerIdUsuario(): string | null {
    return localStorage.getItem('idUsuario');
  }

  // Método para limpiar los datos del usuario del localStorage
  limpiarDatosUsuario(): void {
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
  }
}
