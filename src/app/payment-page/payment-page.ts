// src/app/payment-page/payment-page.ts

import { Component, Input, Output, EventEmitter, WritableSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para @if, @for, pipes
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; // Para Reactive Forms
import { Router } from '@angular/router'; // Para navegar
import { CartItemModel } from '../models/cart-item.model'; // Modelo del carrito

@Component({
  selector: 'app-payment-page',
  imports: [CommonModule, ReactiveFormsModule], // Imports necesarios
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss'
})
export class PaymentPage implements OnInit {

  // 1. INPUT: Recibe el estado del carrito desde app.ts
  @Input() carrito!: WritableSignal<CartItemModel[]>;

  // 2. OUTPUT: Emite el evento para limpiar el carrito (app.ts lo escuchará)
  @Output() clearCartEvent = new EventEmitter<void>();

  // 3. FORMULARIO: Definimos el FormGroup (como en contact-form.ts)
  paymentForm: FormGroup;

  // 4. Inyectamos el Router para la navegación post-pago
  constructor(private router: Router) {
    this.paymentForm = new FormGroup({
      // Hora de entrega (formato hora correcto)
      horaEntrega: new FormControl('', [Validators.required]),
      // Dirección completa
      direccion: new FormControl('', [Validators.required]),
      // Método de pago (Tarjeta o Bizum)
      metodoPago: new FormControl('Tarjeta', [Validators.required]), 
      
      // Campo Tarjeta (se validará condicionalmente)
      numeroTarjeta: new FormControl('', [
        Validators.required, 
        Validators.minLength(16), 
        Validators.maxLength(16), 
        Validators.pattern('^[0-9]*$') // Solo números
      ]),
      
      // Campo Bizum (se validará condicionalmente)
      numeroTelefono: new FormControl('', [
        // Los validadores se añadirán/quitarán dinámicamente
      ])
    });
  }

  // 5. ngOnInit para la lógica condicional (como en profile.ts y apuntes)
  ngOnInit() {
    // Escuchamos los cambios en el radio button 'metodoPago'
    this.metodoPago.valueChanges.subscribe(value => {
      this.actualizarValidadores(value);
    });
    
    // Ejecutamos una vez al inicio para establecer el estado inicial (Tarjeta)
    this.actualizarValidadores(this.metodoPago.value);
  }
actualizarValidadores(metodo: string) {
    if (metodo === 'Tarjeta') {
      // Si es Tarjeta, Tarjeta es REQUERIDO, Teléfono NO
      this.numeroTarjeta.setValidators([Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern('^[0-9]*$')]);
      this.numeroTelefono.clearValidators();
      this.numeroTelefono.setValue(''); // Limpiamos el valor
    } else if (metodo === 'Bizum') {
      // Si es Bizum, Teléfono es REQUERIDO, Tarjeta NO
      this.numeroTelefono.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]);
      this.numeroTarjeta.clearValidators();
      this.numeroTarjeta.setValue(''); // Limpiamos el valor
    }

    // Actualizamos el estado de validación de ambos controles
    this.numeroTarjeta.updateValueAndValidity();
    this.numeroTelefono.updateValueAndValidity();
  }
  // 6. GETTERS: Para acceder fácil a los controles en el HTML (apuntes pág. 39)
  get horaEntrega() { return this.paymentForm.get('horaEntrega')!; }
  get direccion() { return this.paymentForm.get('direccion')!; }
  get metodoPago() { return this.paymentForm.get('metodoPago')!; }
  get numeroTarjeta() { return this.paymentForm.get('numeroTarjeta')!; }
  get numeroTelefono() { return this.paymentForm.get('numeroTelefono')!; }


  /**
   * Acción de Pagar (Punto 3 del examen)
   */
  pagar() {
    if (this.paymentForm.valid) {
      alert('¡Gracias por su pedido! Su pedido está en camino.');
      this.clearCartEvent.emit(); // 1. Emitimos evento para limpiar carrito
      this.paymentForm.reset();
      this.router.navigate(['/pizzas']); // 2. Volvemos a la lista de pizzas
    } else {
      // Marcamos todos los campos como "touched" para mostrar errores
      this.paymentForm.markAllAsTouched();
    }
  }

  /**
   * Acción de Limpiar (Punto 3 del examen)
   */
  limpiar() {
    this.clearCartEvent.emit();
    alert('Pedido limpiado. Volviendo a la lista de pizzas.');
    this.router.navigate(['/pizzas']);
  }

  /**
   * Helper para mostrar el total en la plantilla
   */
  calcularTotal(): number {
    // Leemos el signal del Input
    return this.carrito().reduce((total, item) => total + item.subtotal, 0);
  }
}