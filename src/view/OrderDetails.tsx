import './OrderDetails.css';

import React, { memo, useEffect } from 'react';

import { Order, StatusCode } from '../models/Order';
import { useOrder } from '../state';

export const OrderDetails = memo(({orderId}: {orderId: Order['id']}) => {

  const [order, updateStatus] = useOrder(orderId);

  useEffect(() => {
    console.log(`Order atom updated: ${order.id}`);
  }, [order]);

  return (
    <div className="OrderDetails">
      <div className="OrderDetails__reference">Reference: {order.reference}</div>
      <div className="OrderDetails__status">Status: {order.status}</div>
      <div className="OrderDetails__events">Events: [{order.events.join(', ')}]</div>
      <div className="OrderDetails__items">Items: [{order.items.map((item) => JSON.stringify(item)).join(', ')}]</div>
      <div className="OrderDetaisl__actions">
        {order.status === StatusCode.NEW && <button onClick={() => updateStatus(StatusCode.CONFIRMED)}>Confirmar</button>}
        {order.status === StatusCode.CONFIRMED && <button onClick={() => updateStatus(StatusCode.DISPATCHED)}>Despachar</button>}
        {order.status === StatusCode.DISPATCHED && <button onClick={() => updateStatus(StatusCode.CONCLUDED)}>Concluir</button>}
      </div>
    </div>
  )
})
