// src/app/header/header.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [], 
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  // Título configurable 
  title = input<string>("Valor por defecto");
}