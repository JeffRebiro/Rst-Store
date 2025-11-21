import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react/theme";
import { ThemeProvider } from "next-themes";

import App from "./App";
import store from "./store";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
