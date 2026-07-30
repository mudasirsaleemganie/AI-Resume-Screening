import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./state/AuthContext";
import { RouterProvider } from "./router";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider>
      <AuthProvider><App /></AuthProvider>
    </RouterProvider>
  </React.StrictMode>
);
