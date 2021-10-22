import { get, set } from 'idb-keyval';
import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';

import { Order, StatusCode } from './models/Order';

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

export const ordersAtom = atomWithAsyncStorage<Order[]>('order', []);

export const singleOrderAtom = atomFamily((id: Order['id']) => atom(get => get(ordersAtom).find(o => o.id === id)!));

export const addOrderAtom = atom(null,
  (get, set, order: Order) => set(ordersAtom, [...get(ordersAtom), order])
)

export const updateOrderStatusAtom = atom(null,
  (get, set, [orderId, status]: [Order['id'], StatusCode]) => {
    const newOrders = get(ordersAtom).map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        events: [
          ...order.events,
          status,
        ],
        status,
      }
    });
    set(ordersAtom, newOrders);
})
