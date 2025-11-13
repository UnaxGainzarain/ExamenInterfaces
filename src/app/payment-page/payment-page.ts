// src/app/payment-page/payment-page.ts
import { Component, Input, Output, EventEmitter, WritableSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItemModel } from '../models/cart-item.model';

@Component({
  selector: 'app-payment-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.scss'
})
export class PaymentPage implements OnInit {

  @Input() carrito!: WritableSignal<CartItemModel[]>;
  @Output() clearCartEvent = new EventEmitter<void>();

  paymentForm: FormGroup;
  
  constructor(private router: Router) {
    this.paymentForm = new FormGroup({
      horaEntrega: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      metodoPago: new FormControl('Tarjeta', [Validators.required]), 
      
      numeroTarjeta: new FormControl('', [
        Validators.required, 
        Validators.minLength(16), 
        Validators.maxLength(16), 
        Validators.pattern('^[0-9]*$')
      ]),
      
      numeroTelefono: new FormControl('', [
        // Validadores se añaden dinámicamente
      ])
    });
  }

  ngOnInit() {
    // Escucha cambios en 'metodoPago' para actualizar validadores
    this.metodoPago.valueChanges.subscribe(value => {
      this.actualizarValidadores(value);
    });
    // Actualiza al iniciar
    this.actualizarValidadores(this.metodoPago.value);
  }

  // Getters para el template (como en apuntes pág. 39)
  get horaEntrega() { return this.paymentForm.get('horaEntrega')!; }
  get direccion() { return this.paymentForm.get('direccion')!; }
  get metodoPago() { return this.paymentForm.get('metodoPago')!; }
  get numeroTarjeta() { return this.paymentForm.get('numeroTarjeta')!; }
  get numeroTelefono() { return this.paymentForm.get('numeroTelefono')!; }

  /**
   * Lógica para validación condicional (Punto 3 del examen)
   */
  actualizarValidadores(metodo: string) {
    if (metodo === 'Tarjeta') {
      this.numeroTarjeta.setValidators([Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern('^[0-9]*$')]);
      this.numeroTelefono.clearValidators();
      this.numeroTelefono.setValue(''); 
    } else if (metodo === 'Bizum') {
      this.numeroTelefono.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[0-9]*$')]);
      this.numeroTarjeta.clearValidators();
      this.numeroTarjeta.setValue('');
    }

    this.numeroTarjeta.updateValueAndValidity();
    this.numeroTelefono.updateValueAndValidity();
  }

  /**
   * Acción de Pagar (Punto 3 del examen)
   */
  pagar() {
    if (this.paymentForm.valid) {
      alert('¡Gracias por su pedido! Su pedido está en camino.');
      this.clearCartEvent.emit(); // 1. Emite evento para limpiar carrito
      this.paymentForm.reset();
      this.router.navigate(['/pizzas']); // 2. Vuelve a la lista de pizzas
    } else {
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
   * Helper para mostrar el total
   */
  calcularTotal(): number {
    return this.carrito().reduce((total, item) => total + item.subtotal, 0);
  }
}