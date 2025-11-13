// src/app/pizza-card/pizza-card.ts
import { Component, input, output } from '@angular/core';
import { PizzaModel } from '../models/pizza.model';
import { CommonModule } from '@angular/common';
// Importa FormGroup
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface AddPizzaEvent {
  pizza: PizzaModel;
  cantidad: number;
}

@Component({
  selector: 'app-pizza-card',
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './pizza-card.html',
  styleUrl: './pizza-card.scss'
})
export class PizzaCard {
  pizza = input.required<PizzaModel>();
  addPizzaEvent = output<AddPizzaEvent>();
  
  // 1. Define el FormGroup
  pizzaForm: FormGroup;

  // 2. Inicializa el FormGroup en el constructor
  constructor() {
    this.pizzaForm = new FormGroup({
      // 3. Mete el FormControl DENTRO del group
      cantidad: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }

  get cantidadControl() {
    return this.pizzaForm.get('cantidad') as FormControl;
  }

  // 5. El método de submit ahora usa el 'pizzaForm'
  agregarAlCarrito() {
    if (this.pizzaForm.valid) {
      this.addPizzaEvent.emit({
        pizza: this.pizza(),
        cantidad: this.pizzaForm.value.cantidad // Saca el valor del form
      });
      // 6. Resetea el form, no solo el control
      this.pizzaForm.reset({ cantidad: 1 });
    }
  }
}