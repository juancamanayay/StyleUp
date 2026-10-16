import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  precio: number;
  stock: number;
  enOferta: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  
  private readonly API_LOCAL = 'http://localhost:3000/productos';
  
  private readonly DB_ESTATICO = 'db.json';

  private readonly esLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    if (this.esLocal) {
      return this.http.get<Producto[]>(this.API_LOCAL);
    }
    return this.http
      .get<{ productos: Producto[] }>(this.DB_ESTATICO)
      .pipe(map((datos) => datos.productos));
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.obtenerProductos().pipe(
      map((productos) => productos.find((p) => p.id === Number(id)) as Producto)
    );
  }
}