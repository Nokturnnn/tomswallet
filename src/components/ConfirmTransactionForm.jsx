import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

const ConfirmTransactionForm = () => {
  const [txIndex, setTxIndex] = useState("");

  const { config } = usePrepareContractWrite({
    address: "0x0a8439FA04043E27734F0277FCD2B45a968416EF",
    abi: [
      {
        type: "function",
        name: "confirmTransaction",
        inputs: [
          {
            name: "_txIndex",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "confirmTransaction",
    args: [txIndex],
  });

  const { write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: config?.hash,
  });

  return (
    <>
      <div className="mt-4 border border-blue-400"></div>
      <div className="w-4/5 pt-10 pl-56">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            write();
          }}
          className="bg-white shadow rounded border-2 px-8 pt-6 pb-8 mb-4"
        >
          <input
            type="text"
            value={txIndex}
            onChange={(e) => setTxIndex(e.target.value)}
            placeholder="Enter Transaction Index"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {/* Bouton de confirmation */}
          <button
            className="mt-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Confirm Transaction
          </button>
        </form>
        {isSuccess && <p>Transaction Confirmed!</p>}
        {isLoading && <p>Transaction in Progress...</p>}
      </div>
    </>
  );
};

export default ConfirmTransactionForm;
