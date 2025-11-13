import { PizzaModel } from "./pizza.model";

export class CartItemModel {
  pizza: PizzaModel;
  cantidad: number;

  constructor(pizza: PizzaModel, cantidad: number) {
    this.pizza = pizza;
    this.cantidad = cantidad;
  }

  // Calculamos el subtotal
  get subtotal(): number {
    return this.pizza.precio * this.cantidad;
  }
}