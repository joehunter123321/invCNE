import React from "react";

import ReactDOM from "react-dom/client";
import App from "./App.jsx";


import { UserAuthContextProvider } from "./auth/UserAuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserAuthContextProvider >
    <App />
  </UserAuthContextProvider>
);
