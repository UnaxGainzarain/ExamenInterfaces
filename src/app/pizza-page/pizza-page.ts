// src/app/pizza-page/pizza-page.ts
import { Component, signal, OnInit } from '@angular/core'; // Ya no se necesita Input, Output, etc.
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Importamos los componentes HIJOS que usará
import { PizzaCard, AddPizzaEvent } from '../pizza-card/pizza-card';
import { PaymentPage } from '../payment-page/payment-page'; 

// Importamos los Modelos
import { PizzaModel } from '../models/pizza.model';
import { CartItemModel } from '../models/cart-item.model';

@Component({
  selector: 'app-pizza-page',
  // 1. AÑADIMOS PaymentPage a los imports
  imports: [CommonModule, RouterLink, PizzaCard, PaymentPage], 
  templateUrl: './pizza-page.html',
  styleUrl: './pizza-page.scss'
})
export class PizzaPage implements OnInit {

  // === LA LÓGICA SE MUEVE AQUÍ ===
  pizzasDisponibles = signal<PizzaModel[]>([]);
  carrito = signal<CartItemModel[]>([]);
  
  // 2. Nuevo signal para mostrar/ocultar el pago
  mostrarPago = signal(false); 
  // ===============================

  constructor() { }

  ngOnInit() {
    // (Esto ya lo tenías bien)
    const margarita = new PizzaModel(
      "Margarita", 15.50, "img/pizza-margarita.jpg", ["icons/tomate.png", "icons/queso.png"]
    );
    const bbq = new PizzaModel(
      "BBQ", 18.00, "img/barbacoa.jpg", ["icons/queso.png", "icons/carne.png"]
    );
    const Jamon = new PizzaModel(
      "Jamón Queso", 17.00, "img/JamonQueso.jpg", ["icons/tomate.png", "icons/queso.png"]
    );
    const vegetal = new PizzaModel(
      "Vegetal",  
      16.50, 
      "img/vegetal.jpg", 
      ["icons/tomate.png", "icons/queso.png", "icons/varduras.png"]
    );
    const hawaiana= new PizzaModel(
      "Hawaiana", 
      17.00, 
      "img/hawaiana.jpg", 
      ["icons/tomate.png", "icons/queso.png", "icons/piña.png"]
    );

    const carbonara = new PizzaModel(
      "Carbonara",
      10.00,
      "img/carbonara.jpg",
      ["icons/tomate.png", "icons/queso.png", "icons/carne.png"]
    );
    
    this.pizzasDisponibles.set([margarita, bbq, Jamon, vegetal, hawaiana, carbonara]);
  }

  
  agregarPizzaAlCarrito(event: AddPizzaEvent) {
    const itemEnCarrito = this.carrito().find(
      item => item.pizza.nombre === event.pizza.nombre
    );
    if (itemEnCarrito) {
      this.carrito.update(currentCart => 
        currentCart.map(item => 
          item.pizza.nombre !== event.pizza.nombre 
            ? item 
            : new CartItemModel(item.pizza, item.cantidad + event.cantidad)
        )
      );
    } else {
      const nuevoItem = new CartItemModel(event.pizza, event.cantidad);
      this.carrito.update(currentCart => [...currentCart, nuevoItem]);
    }
  }

  // 4. MOVEMOS LA LÓGICA DE 'app.ts' AQUÍ
  limpiarCarrito() {
    this.carrito.set([]);
    this.mostrarPago.set(false); // Ocultamos el pago al limpiar
  }
  
  // 5. Método para el botón "Ir a Pagar"
  togglePago() {
    this.mostrarPago.set(true); // Solo lo mostramos
  }

  calcularTotal(): number {
    return this.carrito().reduce((total, item) => total + item.subtotal, 0);
  }
}