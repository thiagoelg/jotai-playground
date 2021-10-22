import './OrderList.css';

import React, { Suspense, useCallback, useEffect } from 'react';

import { addOrderAtom, ordersAtom } from '../state';
import { OrderDetails } from './OrderDetails';
import { useAtom } from 'jotai';
import { generateOrderProps } from '../models/Order';

export const OrderList = () => {
  const [orders] = useAtom(ordersAtom);
  const [, addOrder] = useAtom(addOrderAtom);

  useEffect(() => {
    console.log(`Order list updated: ${orders.map(o => o.id).join(', ')}`);
  }, [orders]);

  const addGeneratedOrder = useCallback(() => addOrder(generateOrderProps()), []);
  
  return (
    <div>
      <button onClick={addGeneratedOrder}>Criar Order</button>
        <Suspense fallback="Loading Details...">
          <div className="OrderList">
            {orders.map((order) => (
                <OrderDetails key={order.id} orderId={order.id}/>
            ))}
          </div>
        </Suspense>
    </div>
  )
}