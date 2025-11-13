// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PizzaPage } from './pizza-page/pizza-page';
import { PaymentPage } from './payment-page/payment-page';

export const routes: Routes = [
 { path: 'pizzas', component: PizzaPage },
 { path: 'pago', component: PaymentPage },
 // Ruta por defecto
 { path: '', redirectTo: '/pizzas', pathMatch: 'full' },
 // Redirigir si no encuentra la ruta
 { path: '**', redirectTo: '/pizzas' }
];