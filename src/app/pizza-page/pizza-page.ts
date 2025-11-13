// src/app/pizza-page/pizza-page.ts

// 1. IMPORTA 'OnInit'
import { Component, signal, Input, Output, EventEmitter, WritableSignal, OnInit } from '@angular/core';
import { PizzaModel } from '../models/pizza.model';
import { CartItemModel } from '../models/cart-item.model';
import { PizzaCard, AddPizzaEvent } from '../pizza-card/pizza-card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pizza-page',
  imports: [CommonModule, PizzaCard, RouterLink],
  templateUrl: './pizza-page.html',
  styleUrl: './pizza-page.scss'
})
// 2. AÑADE 'implements OnInit'
export class PizzaPage implements OnInit {

  pizzasDisponibles = signal<PizzaModel[]>([]);

  @Input() carrito!: WritableSignal<CartItemModel[]>; 
  @Output() addPizzaEvent = new EventEmitter<AddPizzaEvent>();

  constructor() { }

  // 3. Ahora Angular SÍ ejecutará este método
  ngOnInit() {
    const margarita = new PizzaModel(
      "Margarita", 
      15.50, 
      "img/pizza-margarita.jpg",
      ["icons/tomate.png", "icons/queso.png"]
    );

    const bbq = new PizzaModel(
      "BBQ", 
      18.00, 
      "img/barbacoa.jpg",
      ["icons/queso.png", "icons/carne.png"]
    );

    const vegetariana = new PizzaModel(
      "Jamón Queso",
      17.00,
      "img/JamonQueso.jpg",
      ["icons/tomate.png", "icons/queso.png"] // Tus archivos no tenían 'verduras.png', he puesto queso.
    );

    this.pizzasDisponibles.set([margarita, bbq, vegetariana]);
  }

  agregarPizzaAlCarrito(event: AddPizzaEvent) {
    this.addPizzaEvent.emit(event);
  }

  calcularTotal(): number {
    return this.carrito().reduce((total, item) => total + item.subtotal, 0);
  }
}