import faker from 'faker';
import { Item, ItemProps } from './Item';
import { Primitifiable } from './Primitifiable';


export enum StatusCode {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  DISPATCHED = 'DISPATCHED',
  CONCLUDED = 'CONCLUDED'
}

export type OrderProps = {
  id: string;
  reference: string;
  status: StatusCode;
  events: StatusCode[];
  items: ItemProps[];
}

export const generateOrderProps = (): OrderProps => ({
  id: faker.datatype.uuid(),
  reference: faker.datatype.number({ min: 1000, max: 9999 }).toString(),
  status: StatusCode.NEW,
  events: [StatusCode.NEW],
  items: Array(faker.datatype.number({ min: 1, max: 4 })).fill(1)
    .map(() => ({
      name: faker.commerce.productName(),
      qtt: faker.datatype.number({ min: 1, max: 15 }),
      price: faker.commerce.price(1, 100, 2, 'R$')
    }))
});


export class Order implements Primitifiable<OrderProps> {
  id: string;
  reference: string;
  status: StatusCode;
  events: StatusCode[];
  items: Item[];

  constructor(props: OrderProps) {
    this.id = props.id;
    this.reference = props.reference;
    this.status = props.status;
    this.events = props.events;
    this.items = props.items.map((item) => new Item(item));
  }

  processEvent(event: StatusCode) {
    this.events.push(event);
    this.status = event;
  }

  canConfirm() {
    return this.status === StatusCode.NEW;
  }

  canDispatch() {
    return this.status === StatusCode.CONFIRMED;
  }

  canConclude() {
    return this.status === StatusCode.DISPATCHED;
  }

  primitify() {
    const { id, reference, status, events, items } = this;
    return {
      id, reference, status, events, items: items.map((item) => item.primitify())
    };
  }
}

export function getOrderIdbKey(id: Order['id']) {
  return `order/${id}`;
}

export function getOrderIdsIdbKey() {
  return `order-ids`;
}

