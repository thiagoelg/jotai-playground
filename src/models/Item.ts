import { Primitifiable } from "./Primitifiable";

export interface ItemProps {
  name: string;
  qtt: number;
  price: string;
}

export class Item implements Primitifiable<ItemProps> {
  name: string;
  qtt: number;
  price: string;
  bla!: string;

  constructor(props: ItemProps) {
    this.name = props.name;
    this.qtt = props.qtt;
    this.price = props.price;
  }

  primitify() {
    const { name, qtt, price } = this;
    return {
      name, qtt, price
    };
  }
}