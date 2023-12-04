import React, { useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const WalletConnector = ({ setProvider }) => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: accountData } = useAccount();

  // Voir les Wallets présents sur mon navigateur
  useEffect(() => {
    console.log("Connectors:", connectors);
  }, [connectors]);

  useEffect(() => {
    if (accountData?.connector) {
      setProvider(accountData.connector);
    }
  }, [accountData, setProvider]);

  // Voir tous les détails des différents wallets
  const handleConnect = (connector) => {
    console.log("Attempting to connect with:", connector);
    if (!connector) {
      console.error("No connector provided");
      return;
    }
    if (!connectors.some((c) => c.id === connector.id)) {
      console.error("Connector not found");
      return;
    }
    connect(connector);
  };

  return (
    <>
      <div className="flex flex-grow text-xl font-medium font-mono">
        <h1>.Toms_MultiSignWallet</h1>
      </div>
      <div className="mt-4 border border-blue-400"></div>
      <div>
        {accountData ? (
          <>
            <div className="mt-4">
              <p className="font-normal">Connected as: {accountData.address}</p>
              <button
                onClick={() => disconnect()}
                className="w-60 h-10 mt-4 bg-red-400 border rounded-md font-normal"
              >
                DISCONNECT WALLET
              </button>
            </div>
          </>
        ) : (
          connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              className="w-80 h-10 mt-4 bg-blue-400 border rounded-md font-normal"
            >
              Connect with {connector.name}
            </button>
          ))
        )}
        <div className="mt-4 border border-blue-400"></div>
      </div>
    </>
  );
};

export default WalletConnector;
