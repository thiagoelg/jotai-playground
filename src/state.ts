import { get, set } from 'idb-keyval';
import { atom, useAtom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { useCallback } from 'react';

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

const ordersAtom = atomWithAsyncStorage<Order[]>('order', []);

const addOrderAtom = atom(null,
  (get, set, order: Order) => set(ordersAtom, [...get(ordersAtom), order])
)

export function useOrderList(): [Order[], (order: Order) => void] {
  const [orders] = useAtom(ordersAtom);
  const [, addOrder] = useAtom(addOrderAtom);
  return [orders, addOrder];
}

const singleOrderAtom = atomFamily((id: Order['id']) => atom(get => get(ordersAtom).find(o => o.id === id)!));

const updateOrderStatusAtom = atom(null,
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
});

export function useOrder(id: Order['id']): [Order, (event: StatusCode) => void] {
  const [order] = useAtom(singleOrderAtom(id));
  const [, updateOrderStatus] = useAtom(updateOrderStatusAtom);
  const updateStatus = useCallback((event: StatusCode) => updateOrderStatus([order.id, event]), [order]);
  return [order, updateStatus];
};
