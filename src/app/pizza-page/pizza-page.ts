// src/app/pizza-page/pizza-page.ts
import { Component, signal, Input, Output, EventEmitter, WritableSignal } from '@angular/core'; // Añadir Input, Output, EventEmitter, WritableSignal
import { PizzaModel } from '../models/pizza.model';
import { CartItemModel } from '../models/cart-item.model';
import { PizzaCard, AddPizzaEvent } from '../pizza-card/pizza-card';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Importamos RouterLink para el botón de Pagar

@Component({
  selector: 'app-pizza-page',
  imports: [CommonModule, PizzaCard, RouterLink], // Añadimos RouterLink
  templateUrl: './pizza-page.html',
  styleUrl: './pizza-page.scss'
})
export class PizzaPage {

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
      "img/margarita.jpg", // <--- CORREGIDO
      ["img/icons/tomate.png", "img/icons/queso.png"] // <--- CORREGIDO
    );

    const bbq = new PizzaModel(
      "BBQ", 
      18.00, 
      "img/bbq.jpg", // <--- CORREGIDO
      ["img/icons/bbq.png", "img/icons/queso.png", "img/icons/carne.png"] // <--- CORREGIDO
    );

    const vegetariana = new PizzaModel(
      "Vegetariana",
      17.00,
      "img/vegetariana.jpg", // <--- CORREGIDO
      ["img/icons/tomate.png", "img/icons/queso.png", "img/icons/verduras.png"] // <--- CORREGIDO
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