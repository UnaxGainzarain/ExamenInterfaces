// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router'; // Asegúrate que está importado

import { routes } from './app.routes'; // Importa tus rutas

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes) // Asegúrate que está aquí
  ]
};