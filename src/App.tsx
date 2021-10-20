import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import './App.css';
import { initAtoms } from './state';
import { OrderList } from './view/OrderList';

function App() {
  const [, doInitAtoms] = useAtom(initAtoms);

  useEffect(() => {
    doInitAtoms();
  }, [doInitAtoms]);

  return (
    <div className="App">
      <OrderList />
    </div>
  );
}

export default App;
