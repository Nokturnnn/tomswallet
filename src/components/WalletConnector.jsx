import React from "react";
import { useConnect, useDisconnect, useAccount } from "wagmi";

const WalletConnector = () => {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div className="flex flex-grow text-xl font-medium font-mono">
        <h1>.Toms_MultiSignWallet</h1>
      </div>
      <div className="mt-4 border border-blue-400"></div>
      <div>
        {isConnected ? (
          <>
            <div className="mt-4">
              <p className="font-normal">Connected as : {address}</p>
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
              onClick={() => connect({ connector })}
              className="w-80 h-10 mt-4 bg-blue-400 border rounded-md font-normal"
            >
              Connect with {connector.name}
            </button>
          ))
        )}
      </div>
      <div className="mt-4 border border-blue-400"></div>
    </>
  );
};

export default WalletConnector;
