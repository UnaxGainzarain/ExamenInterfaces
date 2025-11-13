// src/app/payment-page/payment-page.ts
import { Component, Input, Output, EventEmitter, WritableSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// import { Router } from '@angular/router'; // <-- 1. ELIMINAR IMPORTACIÓN DE ROUTER
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
  
  // 2. ELIMINAR 'Router' DEL CONSTRUCTOR
  constructor() {
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
      numeroTelefono: new FormControl('', [])
    });
  }

  ngOnInit() {
    this.metodoPago.valueChanges.subscribe(value => {
      this.actualizarValidadores(value);
    });
    this.actualizarValidadores(this.metodoPago.value);
  }

  // ... (Getters y 'actualizarValidadores' se quedan igual) ...
  get horaEntrega() { return this.paymentForm.get('horaEntrega')!; }
  get direccion() { return this.paymentForm.get('direccion')!; }
  get metodoPago() { return this.paymentForm.get('metodoPago')!; }
  get numeroTarjeta() { return this.paymentForm.get('numeroTarjeta')!; }
  get numeroTelefono() { return this.paymentForm.get('numeroTelefono')!; }

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

  // 3. SIMPLIFICAR 'pagar'
  pagar() {
    if (this.paymentForm.valid) {
      alert('¡Gracias por su pedido! Su pedido está en camino.');
      this.clearCartEvent.emit(); // Emite el evento
      this.paymentForm.reset();
      // this.router.navigate(['/pizzas']); // <-- ELIMINAR NAVEGACIÓN
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  // 4. SIMPLIFICAR 'limpiar'
  limpiar() {
    alert('Pedido limpiado.');
    this.clearCartEvent.emit(); // Emite el evento
    // this.router.navigate(['/pizzas']); // <-- ELIMINAR NAVEGACIÓN
  }

  calcularTotal(): number {
    return this.carrito().reduce((total, item) => total + item.subtotal, 0);
  }
}