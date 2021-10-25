import faker from 'faker';

import { ItemProps } from './Item';


export enum StatusCode {
  NEW = 'NEW',
  CONFIRMED = 'CONFIRMED',
  DISPATCHED = 'DISPATCHED',
  CONCLUDED = 'CONCLUDED'
}

export type Order = {
  id: string;
  reference: string;
  status: StatusCode;
  events: StatusCode[];
  items: ItemProps[];
}

export const generateOrderProps = (): Order => ({
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
