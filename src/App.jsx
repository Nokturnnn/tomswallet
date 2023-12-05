import React, { useState } from "react";
import WalletConnector from "./components/WalletConnector";
import TransactionForm from "./components/TransactionForm";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);

  // Fonction de validation d'envoie d'ETH
  const submitTransaction = async (to, amount) => {
    if (!provider) {
      console.log("Your wallet is not connected !");
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
