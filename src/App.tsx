import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import './App.css';
import { initAtoms } from './state';
import { OrderList } from './view/OrderList';

function App() {
  const [init, setInit] = useState(false);
  const [, doInitAtoms] = useAtom(initAtoms);

  useEffect(() => {
    doInitAtoms().then(() => setInit(true));
  }, [doInitAtoms, setInit]);

  return (
    <div className="App">
      {init && <OrderList />}
    </div>
  );
}

export default App;
