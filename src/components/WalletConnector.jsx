import React from "react";
import { useConnect, useDisconnect, useAccount, useEnsName } from "wagmi";

const WalletConnector = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address, connector, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { disconnect } = useDisconnect();

  return (
    <>
      <div className="flex flex-grow text-xl font-medium font-mono">
        <h1>.Toms_MultiSignWallet</h1>
      </div>
      {/* Barre de séparation */}
      <div className="mt-4 border border-blue-400"></div>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <div>
        {isConnected ? (
          <>
            <div className="mt-4">
              <p className="font-normal">
                Connected as : {ensName ? `${ensName} (${address})` : address}
              </p>
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
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              className="w-80 h-10 mt-4 bg-purple-400 border rounded-md font-normal"
            >
              Connect with {connector.name}
              {!connector.ready && " (unsupported)"}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                " (connecting)"}
            </button>
          ))
        )}
      </div>
      <div className="mt-4 border border-blue-400"></div>
    </>
  );
};

export default WalletConnector;
