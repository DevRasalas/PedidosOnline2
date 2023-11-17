import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private apiUrl = 'http://localhost:8080/usuario';  

  constructor(private http: HttpClient) { }

  login(correo: string, password: string): Observable<any> {
    const datos = {
      correo,
      password
    };

    return this.http.get<any>(`${this.apiUrl}/login`, { params: datos });
  }

  registrar(nombre: string, apellido: string, correo: string, password: string, rol: string, edad: number): Observable<any> {
    const datos = {
      nombre,
      apellido,
      correo,
      password,
      rol,
      edad
    };

    return this.http.post<any>(`${this.apiUrl}/registrar`, datos);
  }
}
