import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  nombre = '';
  correo = '';
  mensaje = '';
  enviado = false;

  enviar(): void {
    if (!this.nombre || !this.correo || !this.mensaje) {
      return;
    }
    this.enviado = true;
    this.nombre = '';
    this.correo = '';
    this.mensaje = '';
  }
}
