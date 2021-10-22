import './OrderDetails.css';

import React, { memo, useCallback, useEffect, useState } from 'react';

import { Order, OrderProps, StatusCode } from '../models/Order';

export const OrderDetails = memo(({orderProps, updateOrder}: {orderProps: OrderProps, updateOrder: (order: OrderProps) => void}) => {

  const [order] = useState(new Order(orderProps));

  useEffect(() => {
    console.log(`Order atom updated: ${order.id}`);
  }, [order]);

  const addEvent = useCallback((event: StatusCode) => { order.processEvent(event); updateOrder(order.primitify()); }, [updateOrder, order]);

  return (
    <div className="OrderDetails">
      <div className="OrderDetails__reference">Reference: {order.reference}</div>
      <div className="OrderDetails__status">Status: {order.status}</div>
      <div className="OrderDetails__events">Events: [{order.events.join(', ')}]</div>
      <div className="OrderDetails__items">Items: [{order.items.map((item) => JSON.stringify(item)).join(', ')}]</div>
      <div className="OrderDetaisl__actions">
        {order.canConfirm() && <button onClick={() => addEvent(StatusCode.CONFIRMED)}>Confirmar</button>}
        {order.canDispatch() && <button onClick={() => addEvent(StatusCode.DISPATCHED)}>Despachar</button>}
        {order.canConclude() && <button onClick={() => addEvent(StatusCode.CONCLUDED)}>Concluir</button>}
      </div>
    </div>
  )
})
