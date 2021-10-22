import { useAtom } from 'jotai';
import { useReducerAtom } from 'jotai/utils';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { generateOrderProps, OrderProps } from '../models/Order';
import { ordersAtom, ordersReducer } from '../state';
import { OrderDetails } from './OrderDetails';
import './OrderList.css';

export const OrderList = () => {
  const [orders, dispatch] = useReducerAtom(ordersAtom, ordersReducer);

  useEffect(() => {
    console.log(`Order list updated: ${orders.map(o => o.id).join(', ')}`);
  }, [orders]);

  const addOrder = useCallback(() => dispatch({ type: 'add', payload: generateOrderProps()}), []);
  const updateOrder = useCallback((payload: OrderProps) => dispatch({ type: 'update', payload}), []);
  
  return (
    <div>
      <button onClick={addOrder}>Criar Order</button>
        <Suspense fallback="Loading Details...">
          <div className="OrderList">
            {orders.map((order) => (
                <OrderDetails key={order.id} orderProps={order} updateOrder={updateOrder} />
            ))}
          </div>
        </Suspense>
    </div>
  )
}