import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface Usuario {
  nombre: string;
  correo: string;
}

interface UsuarioRegistrado extends Usuario {
  password: string;
}

export type ResultadoLogin = 'ok' | 'registrado' | 'incorrecta' | 'invalido';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly STORAGE_KEY = 'styleup_usuario'; // sesión activa
  private readonly USUARIOS_KEY = 'styleup_usuarios'; // usuarios nuevos (LocalStorage)

  // En tu computadora: JSON Server. Ya publicado: db.json como archivo estático.
  private readonly API_LOCAL = 'http://localhost:3000/usuarios';
  private readonly DB_ESTATICO = 'db.json';
  private readonly esLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión buscando el correo en los usuarios de db.json y en los registrados en LocalStorage.
   * Si el correo no existe en ninguno, crea la cuenta automáticamente.
   * - 'ok': el usuario existía y la contraseña coincide
   * - 'registrado': era un correo nuevo y se creó la cuenta
   * - 'incorrecta': el correo existe pero la contraseña no coincide
   * - 'invalido': faltan datos
   */
  login(correo: string, password: string): Observable<ResultadoLogin> {
    if (!correo || !password) {
      return of('invalido' as ResultadoLogin);
    }

    return this.cargarUsuariosDb().pipe(
      map((usuariosDb) => {
        const locales = this.obtenerUsuariosLocales();
        const existente = [...usuariosDb, ...locales].find(
          (u) => u.correo.toLowerCase() === correo.toLowerCase()
        );

        if (existente) {
          if (existente.password !== password) {
            return 'incorrecta' as ResultadoLogin;
          }
          this.guardarSesion(existente);
          return 'ok' as ResultadoLogin;
        }

        const nuevo: UsuarioRegistrado = { nombre: correo.split('@')[0], correo, password };
        locales.push(nuevo);
        localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(locales));
        this.guardarSesion(nuevo);
        return 'registrado' as ResultadoLogin;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  estaAutenticado(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  obtenerUsuario(): Usuario | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /** Cambia el nombre del usuario en la sesión y, si es una cuenta creada en el navegador, también en su registro. */
  actualizarNombre(nombre: string): void {
    const usuario = this.obtenerUsuario();
    const nuevoNombre = nombre.trim();
    if (!usuario || !nuevoNombre) {
      return;
    }
    this.guardarSesion({ ...usuario, nombre: nuevoNombre });

    const locales = this.obtenerUsuariosLocales();
    const local = locales.find((u) => u.correo.toLowerCase() === usuario.correo.toLowerCase());
    if (local) {
      local.nombre = nuevoNombre;
      localStorage.setItem(this.USUARIOS_KEY, JSON.stringify(locales));
    }
  }

  /** Lee los usuarios guardados en db.json. Si no se puede leer, devuelve una lista vacía. */
  private cargarUsuariosDb(): Observable<UsuarioRegistrado[]> {
    const origen = this.esLocal
      ? this.http.get<UsuarioRegistrado[]>(this.API_LOCAL)
      : this.http
          .get<{ usuarios: UsuarioRegistrado[] }>(this.DB_ESTATICO)
          .pipe(map((datos) => datos.usuarios));
    return origen.pipe(catchError(() => of([] as UsuarioRegistrado[])));
  }

  private guardarSesion(usuario: Usuario): void {
    const sesion: Usuario = { nombre: usuario.nombre, correo: usuario.correo };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sesion));
  }

  private obtenerUsuariosLocales(): UsuarioRegistrado[] {
    const data = localStorage.getItem(this.USUARIOS_KEY);
    return data ? JSON.parse(data) : [];
  }
}