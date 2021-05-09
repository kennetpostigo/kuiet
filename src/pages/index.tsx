import React from "react";
import { ColorModeSwitcher } from "../chakra/ColorSwitcher";
import OrderBook from "../components/Orderbook";

function App() {
  return (
    <>
      <ColorModeSwitcher />
      <OrderBook />
    </>
  );
}

export default App;
