import { Atom, atom, useAtom, WritableAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { generateOrderProps, getOrderIdbKey, getOrderIdsIdbKey, Order, OrderProps } from './models/Order';
import { get, set } from 'idb-keyval';
import { atomWithStorage, useUpdateAtom, atomFamily } from 'jotai/utils';
import deepEqual from 'fast-deep-equal'

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

export const ordersAtom = atomWithAsyncStorage<Record<OrderProps['id'], OrderProps>>('order', {});

// export const orderIdsAtom = atomWithAsyncStorage<OrderProps['id'][]>(getOrderIdsIdbKey(), []);
export const orderIdsAtom = atom(
  (get) => Object.keys(get(ordersAtom)));

export const singleOrderAtom = (id: OrderProps['id']) => atom(
  (get) => new Order(get(ordersAtom)[id]!),
  (get, set, updatedOrderA: Order) => {
    const updatedOrder = updatedOrderA.primitify();
    const orders = get(ordersAtom);
    orders[updatedOrder.id] = updatedOrder;
    set(ordersAtom, {...orders});
    // you can set as many atoms as you want at the same time
  }
);

// atomFamily<Param, AtomType extends Atom<unknown>>(initializeAtom: (param: Param) => AtomType, areEqual?: (a: Param, b: Param) => boolean): AtomFamily<Param, AtomType>;

// declare type AtomFamily<Param, AtomType> = {
//   (param: Param): AtomType;
//   remove(param: Param): void;
//   setShouldRemove(shouldRemove: ShouldRemove<Param> | null): void;
// };

const orderAtom = atomFamily<string, WritableAtom<Order, Order, void>>((id) => singleOrderAtom(id), deepEqual);

export function useOrder(id: string) {
  const myAtom = useMemo(() => orderAtom(id), [id]);
  const atomReturn = useAtom(myAtom);
  return atomReturn;

  // const orderInstance = useMemo(() => new Order(order), [order]);

  // const updateOrderFromIntance = useCallback((updatedOrder) => {
  //   const primitifiedOrder = updatedOrder.primitify();
  //   updateOrders();
  // }, [updateOrders]);

  // return [orderInstance, updateOrderFromIntance];
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
    setOrders((currentOrders) => ({...currentOrders, [newOrderProps.id]: newOrderProps}));
  }, [setOrders]);

  return addOrder;
}
