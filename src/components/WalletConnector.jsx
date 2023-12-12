import React, { useEffect } from "react";
import { useConnect, useDisconnect, useAccount, useEnsName } from "wagmi";

// Composant pour connecter et déconnecter un portefeuille utilisateur.
const WalletConnector = ({ onConnectionChange }) => {
  // Hooks wagmi pour gérer la connexion et l'information du compte.
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  // Utilisation de useEffect pour notifier l'état de connexion.
  useEffect(() => {
    // Appelle onConnectionChange chaque fois que l'état de isConnected change.
    onConnectionChange(isConnected);
  }, [isConnected, onConnectionChange]);

  return (
    <>
      <div className="flex flex-grow text-xl font-medium font-mono">
        <h1>.Toms_MultiSignWallet</h1>
      </div>
      {/* Barre de séparation */}
      <div className="mt-4 border border-blue-400"></div>

      {/* Affichage des erreurs, le cas échéant. */}
      {error && <p className="text-red-500">Erreur : {error.message}</p>}
      <div>
        {/* Condition pour afficher l'interface de connexion ou de déconnexion. */}
        {isConnected ? (
          <>
            <div className="mt-4">
              {/* Affiche l'adresse du compte connecté, ou le nom ENS s'il existe. */}
              <p className="font-normal">
                CONNECTED AS :{" "}
                <div className="pt-2 font-mono text-blue-500 font-medium">
                  {ensName ? `${ensName} (${address})` : address}
                </div>
              </p>
              {/* Bouton pour déconnecter le portefeuille. */}
              <button
                onClick={() => disconnect()}
                className="w-60 h-10 mt-3 bg-red-400 border rounded-md font-normal"
              >
                DISCONNECT YOUR WALLET
              </button>
            </div>
          </>
        ) : (
          // Boucle sur les connecteurs disponibles pour la connexion.
          connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              className="w-80 h-10 mt-4 bg-purple-400 border rounded-md font-normal"
            >
              CONNECTED AS <span className="uppercase">{connector.name}</span>
              {!connector.ready && " (non pris en charge)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (en connexion)"}
            </button>
          ))
        )}
        {error && <div>{error.message}</div>}
      </div>
      <div className="mt-4 border border-blue-400"></div>
    </>
  );
};

export default WalletConnector;
