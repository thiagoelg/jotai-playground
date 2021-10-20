import { atom, useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { generateOrderProps, getOrderIdbKey, getOrderIdsIdbKey, Order, OrderProps } from './models/Order';
import { get, set } from 'idb-keyval';
import { atomWithStorage, useUpdateAtom } from 'jotai/utils';

function atomWithAsyncStorage<T>(key: string, initial: T, storeName?: string) {
  return atomWithStorage<T>(key, initial, {
    setItem: (key, value) => set(key, value),
    getItem: (key) =>
      get<T>(key).then((value) => {
        if (value !== undefined) {
          return value;
        }
        set(key, initial);
        return initial;
      }),
  });
}

export const ordersAtom = atomWithAsyncStorage<OrderProps[]>('order', []);

// export const orderIdsAtom = atomWithAsyncStorage<OrderProps['id'][]>(getOrderIdsIdbKey(), []);
export const orderIdsAtom = atom((get) => get(ordersAtom).map((order) => order.id));

export const singleOrderAtom = (id: OrderProps['id']) => atom((get) => get(ordersAtom).find((order) => order.id === id)!);

export function useOrder(id: string): [Order, (updatedOrder: any) => void | Promise<void>] {
  const orderAtom = singleOrderAtom(id);
  const [order, updateOrder] = useAtom(orderAtom);
  const updateOrders = useUpdateAtom(ordersAtom);

  const orderInstance = useMemo(() => new Order(order), [order]);

  const updateOrderFromIntance = useCallback((updatedOrder) => {
    const primitifiedOrder = updatedOrder.primitify();
    updateOrders((currentOrders) => currentOrders.map((order) => order.id === primitifiedOrder.id ? primitifiedOrder : order));
  }, [updateOrder]);

  return [orderInstance, updateOrderFromIntance];
}

export function useOrdersIds() {
  const [ids] = useAtom(orderIdsAtom);

  return ids;
}

export function useCreateOrder() {
  const [, setOrders] = useAtom(ordersAtom);

  const addOrder = useCallback(() => {
    const newOrderProps = generateOrderProps();
    // atomWithAsyncStorage<OrderProps>(
    //   getOrderIdbKey(newOrderProps.id),
    //   newOrderProps
    // );
    setOrders((currentOrders) => [...currentOrders, newOrderProps]);
  }, [setOrders]);

  return addOrder;
}
