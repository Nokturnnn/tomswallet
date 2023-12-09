import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

const ExecuteTransaction = () => {
  const [txIndex, setTxIndex] = useState("");

  const onChange = (e) => {
    setTxIndex(e.target.value);
  };

  // Préparation de l'écriture du contrat pour l'exécution de transaction
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x0a8439FA04043E27734F0277FCD2B45a968416EF",
    abi: [
      {
        type: "function",
        name: "executeTransaction",
        inputs: [
          { name: "_txIndex", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "executeTransaction",
    args: [txIndex], // L'index de la transaction à exécuter
  });

  const { write, error, isError } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: write?.data?.hash,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    write?.();
  };

  return (
    <>
      <div className="mt-8 border border-blue-400"></div>
      <div className="w-4/5 pt-10 pl-56">
        <form
          onSubmit={onSubmit}
          className="bg-white shadow rounded border-2 px-8 pt-6 pb-8 mb-4"
        >
          {/* Champ pour l'index de transaction */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Transaction Index:
            </label>
            <input
              type="number"
              value={txIndex}
              onChange={onChange}
              placeholder="Enter transaction index"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Bouton de soumission */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!write || isLoading}
          >
            {isLoading ? "Processing..." : "Execute Transaction"}
          </button>

          {/* Messages de statut */}
          {isSuccess && <div>Transaction executed!</div>}
          {(isPrepareError || isError) && (
            <div>Error: {(prepareError || error)?.message}</div>
          )}
        </form>
      </div>
    </>
  );
};

export default ExecuteTransaction;
