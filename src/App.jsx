import React, { useState } from "react";
import WalletConnector from "./components/WalletConnector";
import TransactionForm from "./components/TransactionForm";
// import { WagmiConfig, usePublicClient } from "wagmi";
import "./App.css";
import ConfirmTransactionForm from "./components/ConfirmTransactionForm.jsx";
import Deposit from "./components/Deposit.jsx";
import ExecuteTransactionForm from "./components/ExecuteTransaction.jsx";

function App() {
  return (
    <div className="App">
      <WalletConnector />
      <Deposit />
      <TransactionForm />
      <ConfirmTransactionForm />
      <ExecuteTransactionForm />
    </div>
  );
}

export default App;
