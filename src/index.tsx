import React from "react";
import ReactDOM from "react-dom";
import App from "./pages";

import reportWebVitals from "./reportWebVitals";
import "react-activity/dist/react-activity.css";
import { Chakra } from "./chakra/Chakra";

ReactDOM.render(
  <React.StrictMode>
    <Chakra>
      <App />
    </Chakra>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
