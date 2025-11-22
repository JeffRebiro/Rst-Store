// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import App from "./App";
import store from "./store";
import { Provider as UIProvider } from "./components/ui/Provider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <UIProvider>
        <App />
      </UIProvider>
    </ReduxProvider>
  </React.StrictMode>
);