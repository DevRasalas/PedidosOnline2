import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { OrdenConProducto } from '../orden-con-producto';


@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'http://localhost:8080/ordenes';

  constructor(private http: HttpClient) { }

  crearOrdenConProducto(ordenes: OrdenConProducto): Observable<any> {
    const url = `${this.apiUrl}/add-ordenes`;
    return this.http.post(url, ordenes);
  }

  mostrarOrdenes(idUsuario: any): Observable <any>{
    const params = new HttpParams().set('idUsuario', idUsuario.toString());
    return this.http.get(`${this.apiUrl}/ver-ordenes`, { params });
  }
  
}
