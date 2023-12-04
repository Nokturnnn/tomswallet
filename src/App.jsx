import React, { useState } from "react";
import WalletConnector from "./components/WalletConnector";
import TransactionForm from "./components/TransactionForm";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);

  const submitTransaction = async (to, amount) => {
    if (!provider) {
      console.log("Wallet not connected");
      return;
    }
  };

  return (
    <div className="App">
      <WalletConnector setProvider={setProvider} />
      <TransactionForm submitTransaction={submitTransaction} />
    </div>
  );
}

export default App;
