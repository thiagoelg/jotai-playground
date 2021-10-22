import { get, set } from 'idb-keyval';
import { atomWithStorage } from 'jotai/utils';

import { OrderProps } from './models/Order';

function atomWithAsyncStorage<T>(key: string, initial: T) {
  return atomWithStorage<T>(key, initial, {
    setItem: (key, value) => set(key, value),
    getItem: (key) =>
      get<T>(key).then((value) => {
        if (value !== undefined) {
          return value;
        }
        if (initial !== undefined) {
          set(key, initial);
        }
        return initial;
      }),
  });
}

export const ordersAtom = atomWithAsyncStorage<OrderProps[]>('order', []);

export interface OrdersActions {
  type: 'add' | 'update';
  payload: OrderProps;
}

export const ordersReducer = (orders: OrderProps[], {type, payload}: OrdersActions) => {
  console.log('reducer', type, payload, orders);
  if (type === 'add') {
    return [...orders, payload];
  }
  if(type === 'update') {
    return orders.map(order => order.id === payload.id ? payload : order);
  }
  throw new Error('unknown action type')
}
