// src/app/pizza-page/pizza-page.ts
import { Component, signal, Input, Output, EventEmitter, WritableSignal, OnInit } from '@angular/core';import { PizzaModel } from '../models/pizza.model';
import { CartItemModel } from '../models/cart-item.model';
import { AddPizzaEvent, PizzaCard } from '../pizza-card/pizza-card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Importamos RouterLink para el botón de Pagar

@Component({
  selector: 'app-pizza-page',
  imports: [CommonModule, RouterLink, PizzaCard], // Añadimos RouterLink
  templateUrl: './pizza-page.html',
  styleUrl: './pizza-page.scss'
})
export class PizzaPage  implements OnInit{

  pizzasDisponibles = signal<PizzaModel[]>([]);

  // 1. Recibe el carrito como Input
  @Input() carrito!: WritableSignal<CartItemModel[]>;
  // 2. Emite el evento para añadir
  @Output() addPizzaEvent = new EventEmitter<AddPizzaEvent>();

 constructor() { }

  ngOnInit() {
    // Rutas corregidas (sin 'assets/'):
    const margarita = new PizzaModel(
      "Margarita", 
      15.50, 
      "img/pizza-margarita.jpg", // <--- CORREGIDO
      ["icons/tomate.png", "icons/queso.png"] // <--- CORREGIDO
    );

    const bbq = new PizzaModel(
      "BBQ", 
      18.00, 
      "img/barbacoa.jpg", // <--- CORREGIDO
      [ "icons/queso.png", "icons/carne.png"] // <--- CORREGIDO
    );

    const vegetariana = new PizzaModel(
      "Jamón Queso",
      17.00,
      "img/JamonQueso.jpg", // <--- CORREGIDO
      ["icons/tomate.png", "icons/queso.png", "icons/verduras.png"] // <--- CORREGIDO
    );

    this.pizzasDisponibles.set([margarita, bbq, vegetariana]);
  }

  // 3. El método ahora solo emite el evento
  agregarPizzaAlCarrito(event: AddPizzaEvent) {
    this.addPizzaEvent.emit(event);
  }

  calcularTotal(): number {
    // Lee del signal recibido por Input
    return this.carrito().reduce((total, item) => total + item.subtotal, 0);
  }
}