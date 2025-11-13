// src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { CommonModule } from '@angular/common';

import { CartItemModel } from './models/cart-item.model';
import { AddPizzaEvent } from './pizza-card/pizza-card';
import { PizzaPage } from './pizza-page/pizza-page';
import { PaymentPage } from './payment-page/payment-page';

@Component({
  selector: 'app-root',
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

  // === MÉTODO CORREGIDO ===
  agregarPizzaAlCarrito(event: AddPizzaEvent) {
    const itemEnCarrito = this.carrito().find(
      item => item.pizza.nombre === event.pizza.nombre
    );

    if (itemEnCarrito) {
      // Actualización Inmutable
      this.carrito.update(currentCart => 
        currentCart.map(item => 
          item.pizza.nombre !== event.pizza.nombre 
            ? item 
            : new CartItemModel(item.pizza, item.cantidad + event.cantidad)
        )
      );
    } else {
      // Añadir nuevo item (esto estaba bien)
      const nuevoItem = new CartItemModel(event.pizza, event.cantidad);
      this.carrito.update(currentCart => [...currentCart, nuevoItem]);
    }
  }
  // ==========================

  limpiarCarrito() {
    this.carrito.set([]);
  }

  onRouterOutletActivate(componente: any) {
    
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