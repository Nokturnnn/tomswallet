import React, { useState } from "react";
import WalletConnector from "./components/WalletConnector";
import TransactionForm from "./components/TransactionForm";
import ConfirmTransactionForm from "./components/ConfirmTransactionForm";
import Deposit from "./components/Deposit";
import ExecuteTransactionForm from "./components/ExecuteTransaction";
import "./App.css";

// Composant principal de l'application.
function App() {
  const [isConnected, setIsConnected] = useState(false); // État pour gérer la connexion au portefeuille.

  return (
    <div className="App">
      {/* Composant pour la connexion au portefeuille. */}
      <WalletConnector onConnectionChange={setIsConnected} />

      {/* Affiche les autres composants seulement si l'utilisateur est connecté. */}
      {isConnected && (
        <>
          {/* Composant pour déposer des fonds. */}
          <Deposit />
          {/* Composant pour soumettre une nouvelle transaction. */}
          <TransactionForm />
          {/* Composant pour confirmer une transaction existante. */}
          <ConfirmTransactionForm />
          {/* Composant pour exécuter une transaction confirmée. */}
          <ExecuteTransactionForm />
        </>
      )}
    </div>
  );
}

export default App;
