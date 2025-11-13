// src/app/pizza-card/pizza-card.ts
import { Component, input, output, signal } from '@angular/core';
import { PizzaModel } from '../models/pizza.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Usaremos @for y @if

// Definimos lo que vamos a emitir
export interface AddPizzaEvent {
  pizza: PizzaModel;
  cantidad: number;
}

@Component({
  selector: 'app-pizza-card',
  // Importamos CommonModule y ReactiveFormsModule
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './pizza-card.html',
  styleUrl: './pizza-card.scss'
})
export class PizzaCard {
  // Input para recibir la pizza (como en foto-personal)
  pizza = input.required<PizzaModel>();

  // Output para añadir al carrito (como clickFoto en foto-personal)
  addPizzaEvent = output<AddPizzaEvent>();

  // Formulario para la cantidad, como en los apuntes [cite: 839]
  cantidadControl = new FormControl(1, [Validators.required, Validators.min(1)]);

  agregarAlCarrito() {
    if (this.cantidadControl.valid && this.cantidadControl.value) {
      // Emitimos el evento con la pizza y la cantidad
      this.addPizzaEvent.emit({
        pizza: this.pizza(),
        cantidad: this.cantidadControl.value
      });
      // Reseteamos la cantidad a 1
      this.cantidadControl.setValue(1);
    }
  }
}