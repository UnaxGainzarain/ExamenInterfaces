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

  // === ESTE ES EL MÉTODO QUE NECESITAS CORREGIR ===
  
  agregarPizzaAlCarrito(event: AddPizzaEvent) {
    
    const itemEnCarrito = this.carrito().find(
      item => item.pizza.nombre === event.pizza.nombre
    );

    if (itemEnCarrito) {
      // SI LA PIZZA YA EXISTE:
      // Usamos .map() para crear un NUEVO array (inmutabilidad)
      this.carrito.update(currentCart => 
        currentCart.map(item => 
          item.pizza.nombre !== event.pizza.nombre 
            ? item // No es el item, lo devolvemos tal cual
            // Es el item, creamos un NUEVO CartItemModel
            : new CartItemModel(item.pizza, item.cantidad + event.cantidad)
        )
      );
    } else {
      // SI LA PIZZA ES NUEVA:
      const nuevoItem = new CartItemModel(event.pizza, event.cantidad);
      this.carrito.update(currentCart => [...currentCart, nuevoItem]);
    }
  }

  // ===============================================

  limpiarCarrito() {
    this.carrito.set([]);
  }

  onRouterOutletActivate(componente: any) {
    
    if (componente instanceof PizzaPage || componente instanceof PaymentPage) {
      componente.carrito = this.carrito;
    }

    if (componente instanceof PizzaPage) {
      // (Esta suscripción llama al método 'agregarPizzaAlCarrito' de ARRIBA)
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