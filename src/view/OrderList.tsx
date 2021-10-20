import { useAtom } from 'jotai';
import React, { Suspense, useEffect } from 'react';
import { orderIdsAtom, useCreateOrder } from '../state';
import { OrderDetails } from './OrderDetails';
import './OrderList.css';

export const OrderList = () => {
  const [ids] = useAtom(orderIdsAtom);
  const addOrder = useCreateOrder();

  useEffect(() => {
    console.log(`Order list updated: ${ids.join(', ')}`);
  }, [ids]);
  
  return (
    <div>
      <button onClick={addOrder}>Criar Order</button>
      <div className="OrderList">
        {ids.map((id) => (
          <Suspense fallback="Loading order details..." key={id}>
            <OrderDetails id={id} />
          </Suspense>
        ))}
      </div>
    </div>
  )
}