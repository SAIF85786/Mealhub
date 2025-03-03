import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./custom.scss";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "react-bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
