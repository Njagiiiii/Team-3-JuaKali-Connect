import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import "leaflet/dist/leaflet.css";

import App from "./App";
import "./styles/style.css";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>

    <ThemeProvider>

        <AuthProvider>

            <App />

        </AuthProvider>

    </ThemeProvider>

</BrowserRouter>
);