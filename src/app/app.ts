// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    RouterOutlet, 
    Header, 
    Footer
    // Ya no necesitamos PizzaPage ni PaymentPage aquí
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // ¡Toda la lógica del carrito ha sido movida a 'pizza-page.ts'!
  // Ya no necesitamos 'onRouterOutletActivate'
}