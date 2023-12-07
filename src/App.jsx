import React, { useState } from "react";
import WalletConnector from "./components/WalletConnector";
import TransactionForm from "./components/TransactionForm";
// import { WagmiConfig, usePublicClient } from "wagmi";
import "./App.css";

function App() {
  return (
    <div className="App">
      <WalletConnector />
      <TransactionForm />
    </div>
  );
}

export default App;
