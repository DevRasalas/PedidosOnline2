import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { AgregarProductosComponent } from './agregar-productos/agregar-productos.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'productos', redirectTo: '/menu', pathMatch: 'full' }, // Redirect to MenuComponent for /productos
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'app', component: AppComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
