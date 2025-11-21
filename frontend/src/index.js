// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "next-themes";

import App from "./App";
import store from "./store";
import { Provider as UIProvider } from "../components/ui/provider"; // your Chakra wrapper

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <UIProvider>
          <App />
        </UIProvider>
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>
);
