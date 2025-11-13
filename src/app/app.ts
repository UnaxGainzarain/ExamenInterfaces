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
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
  // 1. El estado (la "fuente de la verdad") vive aquí
  carrito = signal<CartItemModel[]>([]);

  // 2. Este método actualiza el estado de forma inmutable
  agregarPizzaAlCarrito(event: AddPizzaEvent) {
    
    const itemEnCarrito = this.carrito().find(
      item => item.pizza.nombre === event.pizza.nombre
    );

    if (itemEnCarrito) {
      // SI LA PIZZA YA EXISTE:
      this.carrito.update(currentCart => 
        currentCart.map(item => 
          item.pizza.nombre !== event.pizza.nombre 
            ? item 
            : new CartItemModel(item.pizza, item.cantidad + event.cantidad)
        )
      );
    } else {
      // SI LA PIZZA ES NUEVA:
      const nuevoItem = new CartItemModel(event.pizza, event.cantidad);
      this.carrito.update(currentCart => [...currentCart, nuevoItem]);
    }
  }

  limpiarCarrito() {
    this.carrito.set([]);
  }

  onRouterOutletActivate(componente: any) {
    
    // PASO A: Pasa el carrito [Input] "hacia abajo" al componente hijo
    if (componente instanceof PizzaPage || componente instanceof PaymentPage) {
      componente.carrito = this.carrito;
    }

    // PASO B: Se suscribe al (Output) "hacia arriba" del hijo (PizzaPage)
    if (componente instanceof PizzaPage) {
      componente.addPizzaEvent.subscribe((event: AddPizzaEvent) => {
        this.agregarPizzaAlCarrito(event);
      });
    }

    // PASO C: Se suscribe al (Output) "hacia arriba" del hijo (PaymentPage)
    if (componente instanceof PaymentPage) {
      componente.clearCartEvent.subscribe(() => {
        this.limpiarCarrito();
      });
    }
  }
}