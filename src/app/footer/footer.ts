import { Component, input } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  // Creador configurable 
  creador = input<string>("Anónimo");

  // Año calculado 
  currentYear = new Date().getFullYear();
}