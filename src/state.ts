import { atom, useAtom, WritableAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { generateOrderProps, getOrderIdbKey, getOrderIdsIdbKey, Order, OrderProps } from './models/Order';
import { set as idbSet, get as idbGet } from 'idb-keyval';

export const orderMap: Record<OrderProps['id'], WritableAtom<OrderProps, OrderProps>> = {};

export const orderIdsAtom = atom<OrderProps['id'][]>([]);

export const orderAtom = (id: OrderProps['id']) => orderMap[id];

export function useOrder(id: string): [Order, (updatedOrder: any) => void | Promise<void>] {
  const [order, updateOrder] = useAtom(orderMap[id]);

  const orderInstance = useMemo(() => new Order(order), [order]);

  const updateOrderFromIntance = useCallback(async (updatedOrder) => {
    const primitifiedOrder = updatedOrder.primitify();
    updateOrder(primitifiedOrder);
    await idbSet(getOrderIdbKey(primitifiedOrder.id), primitifiedOrder);
  }, [updateOrder]);

  return [orderInstance, updateOrderFromIntance];
}

export function useOrdersIds() {
  const [ids] = useAtom(orderIdsAtom);

  return ids;
}

export function useCreateOrder() {
  const [, setIds] = useAtom(orderIdsAtom);

  const addOrder = useCallback(async () => {
    const newOrderProps = generateOrderProps();
    orderMap[newOrderProps.id] = atom(newOrderProps);
    setIds((currentIds) => {
      const updatedIds = [...currentIds, newOrderProps.id];
      idbSet(getOrderIdsIdbKey(), updatedIds);
      return updatedIds;
    });
    await idbSet(getOrderIdbKey(newOrderProps.id), newOrderProps);
  }, [setIds]);

  return addOrder;
}

export const initAtoms = atom(
  get => get(orderIdsAtom),
  async (_get, set) => {
    const ids = await idbGet(getOrderIdsIdbKey()) || [];
    set(orderIdsAtom, ids);
    for (const id of ids) {
      const order = await idbGet(getOrderIdbKey(id));
      orderMap[order.id] = atom(order);
    }
  }
);
