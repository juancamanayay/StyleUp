import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Productos } from './pages/productos/productos';
import { Ofertas } from './pages/ofertas/ofertas';
import { Tienda } from './pages/tienda/tienda';
import { Contacto } from './pages/contacto/contacto';
import { MiCuenta } from './pages/mi-cuenta/mi-cuenta';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'productos', component: Productos },
  { path: 'ofertas', component: Ofertas },
  { path: 'tienda', component: Tienda },
  { path: 'contacto', component: Contacto },
  { path: 'mi-cuenta', component: MiCuenta },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' },
];
