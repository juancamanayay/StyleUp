import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  correo = '';
  password = '';
  errorLogin = false;
  mensajeError = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  iniciarSesion(): void {
    this.auth.login(this.correo, this.password).subscribe((resultado) => {
      if (resultado === 'ok' || resultado === 'registrado') {
        this.errorLogin = false;
        if (resultado === 'registrado') {
          alert('¡Cuenta creada! Como ese correo no estaba registrado, te registramos automáticamente.');
        }
        this.router.navigate(['/dashboard']);
        return;
      }

      this.errorLogin = true;
      this.mensajeError =
        resultado === 'incorrecta'
          ? 'La contraseña es incorrecta para ese correo.'
          : 'Ingresa un correo y una contraseña.';
      this.cdr.detectChanges();
    });
  }
}