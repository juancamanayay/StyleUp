import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DatePipe, UpperCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  hoy = new Date();
  totalProductos = 0;
  totalOfertas = 0;

  constructor(
    public auth: Auth,
    private router: Router,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe((productos) => {
      this.totalProductos = productos.length;
      this.totalOfertas = productos.filter((p) => p.enOferta).length;
      this.cdr.detectChanges();
    });
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}