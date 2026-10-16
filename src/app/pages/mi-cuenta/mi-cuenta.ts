import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-mi-cuenta',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mi-cuenta.html',
  styleUrl: './mi-cuenta.css',
})
export class MiCuenta implements OnInit {
  nombreEditable = '';
  guardado = false;

  constructor(public auth: Auth, private router: Router) {}

  ngOnInit(): void {
    this.nombreEditable = this.auth.obtenerUsuario()?.nombre ?? '';
  }

  get inicial(): string {
    return (this.auth.obtenerUsuario()?.nombre ?? '?').charAt(0).toUpperCase();
  }

  guardarNombre(): void {
    this.auth.actualizarNombre(this.nombreEditable);
    this.guardado = true;
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}