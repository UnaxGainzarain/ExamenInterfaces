// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { CommonModule } from '@angular/common';

import { CartItemModel } from './models/cart-item.model';
import { AddPizzaEvent } from './pizza-card/pizza-card';
import { PizzaPage } from './pizza-page/pizza-page';       // <--- Importar
import { PaymentPage } from './payment-page/payment-page'; // <--- Importar

@Component({
  selector: 'app-root',
  // Asegúrate de que PizzaPage y PaymentPage están aquí
  imports: [
    CommonModule, 
    RouterOutlet, 
    Header, 
    Footer, 
    PizzaPage,    
    PaymentPage   
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
  carrito = signal<CartItemModel[]>([]);

  // ... (El resto de tus métodos: agregarPizzaAlCarrito, limpiarCarrito, onRouterOutletActivate)
  agregarPizzaAlCarrito(event: AddPizzaEvent) {
    const itemEnCarrito = this.carrito().find(
      item => item.pizza.nombre === event.pizza.nombre
    );

    if (itemEnCarrito) {
      this.carrito.update(currentCart => {
        itemEnCarrito.cantidad += event.cantidad;
        return [...currentCart]; 
      });
    } else {
      const nuevoItem = new CartItemModel(event.pizza, event.cantidad);
      this.carrito.update(currentCart => [...currentCart, nuevoItem]);
    }
  }

  limpiarCarrito() {
    this.carrito.set([]);
  }

  onRouterOutletActivate(componente: any) {
    // Esta comprobación ahora funcionará
    if (componente instanceof PizzaPage || componente instanceof PaymentPage) {
      componente.carrito = this.carrito;
    }

    if (componente instanceof PizzaPage) {
      componente.addPizzaEvent.subscribe((event: AddPizzaEvent) => {
        this.agregarPizzaAlCarrito(event);
      });
    }

    if (componente instanceof PaymentPage) {
      componente.clearCartEvent.subscribe(() => {
        this.limpiarCarrito();
      });
    }
  }
}