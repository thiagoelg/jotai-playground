import { PrimitiveAtom, useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { generateOrderProps, getOrderIdbKey, getOrderIdsIdbKey, Order, OrderProps } from './models/Order';
import { get as getItem, set as setItem } from 'idb-keyval';
import { atomWithStorage } from 'jotai/utils';

export function atomWithAsyncStorage<T>(key: string, initial?: T) {
  return atomWithStorage<T>(key, initial || {} as T, {
    setItem,
    getItem: (key) =>
      getItem<T>(key).then((value) => {
        if (value !== undefined) {
          return value;
        }
        if (initial !== undefined) {
          setItem(key, initial);
        }
        return initial as T;
      }),
  });
}

export const orderMap: Record<OrderProps['id'], PrimitiveAtom<OrderProps>> = {};

export const orderIdsAtom = atomWithAsyncStorage<OrderProps['id'][]>(getOrderIdsIdbKey(), []);

export const orderAtom = (id: OrderProps['id']) => orderMap[id];

export function useOrder(id: string): [Order, (updatedOrder: any) => void | Promise<void>] {
  const [order, updateOrder] = useAtom(orderMap[id]);

  const orderInstance = useMemo(() => new Order(order), [order]);

  const updateOrderFromIntance = useCallback((updatedOrder) => {
    const primitifiedOrder = updatedOrder.primitify();
    updateOrder(primitifiedOrder);
  }, [updateOrder]);

  return [orderInstance, updateOrderFromIntance];
}

export function useOrdersIds() {
  const [ids] = useAtom(orderIdsAtom);

  return ids;
}

export function useCreateOrder() {
  const [, setIds] = useAtom(orderIdsAtom);

  const addOrder = useCallback(() => {
    const newOrderProps = generateOrderProps();
    orderMap[newOrderProps.id] = atomWithAsyncStorage<OrderProps>(getOrderIdbKey(newOrderProps.id), newOrderProps);
    setIds((currentIds) => ([...currentIds, newOrderProps.id]));
  }, [setIds]);

  return addOrder;
}
