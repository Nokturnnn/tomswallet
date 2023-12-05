import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const WalletConnector = () => {
  // const { connect, connectors } = useConnect();
  // const { disconnect } = useDisconnect();
  // const { data: accountData, isError, isLoading } = useAccount();
  // const [isConnected, setIsConnected] = useState(false);

  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    console.log(
      `Current connection status: ${isConnected ? "connected" : "disconnected"}`
    );
  }, [isConnected]);

  // useEffect(() => {
  //   console.log("Account data:", accountData);
  //   setIsConnected(!!accountData?.address);
  // }, [accountData]);

  // const handleConnect = async (connectorId) => {
  //   const connector = connectors.find((c) => c.id === connectorId);
  //   if (!connector) {
  //     console.error("Connector not found:", connectorId);
  //     return;
  //   }

  //   try {
  //     await connect({ connector });
  //   } catch (error) {
  //     console.error("Failed to connect:", error);
  //   }
  // };

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
