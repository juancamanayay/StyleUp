import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService, Producto } from '../../services/producto';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  categorias: string[] = ['Todos', 'Hombre', 'Mujer', 'Niños', 'Accesorios'];
  categoriaSeleccionada = 'Todos';
  textoBusqueda = '';
  cargando = true;
  error = false;

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = true;
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter((p) => {
      const coincideCategoria =
        this.categoriaSeleccionada === 'Todos' || p.categoria === this.categoriaSeleccionada;
      const coincideNombre = p.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      return coincideCategoria && coincideNombre;
    });
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }
}
