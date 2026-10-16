import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoService, Producto } from '../../services/producto';

@Component({
  selector: 'app-ofertas',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css',
})
export class Ofertas implements OnInit {
  ofertas: Producto[] = [];
  cargando = true;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.ofertas = data.filter((p) => p.enOferta);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }
}
