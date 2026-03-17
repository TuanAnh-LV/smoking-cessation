import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./index.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/authContext.jsx";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./app/store.js";

// import "antd/dist/reset.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      </AuthProvider>
    </Provider>
  </StrictMode>
);
