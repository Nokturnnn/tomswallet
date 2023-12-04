import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import App from "./App.jsx";
import "./index.css";

const { publicClient } = publicProvider();

const config = createConfig({
  autoConnect: true,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
