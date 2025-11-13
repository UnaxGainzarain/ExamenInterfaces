export class PizzaModel {
  nombre: string;
  precio: number;
  fotoUrl: string;
  ingredientes: string[]; // Rutas a las imágenes de los ingredientes

  constructor(nombre: string, precio: number, fotoUrl: string, ingredientes: string[]) {
    this.nombre = nombre;
    this.precio = precio;
    this.fotoUrl = fotoUrl;
    this.ingredientes = ingredientes;
  }
}