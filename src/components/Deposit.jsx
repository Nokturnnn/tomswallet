import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "ethers";
import { useDebounce } from "use-debounce";

const DepositForm = () => {
  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  let weiValue;
  try {
    weiValue = parseEther(debouncedAmount || "0");
  } catch (error) {
    console.error("Erreur de conversion en wei:", error);
  }
  // Préparation de l'écriture du contrat pour le dépôt
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x0a8439FA04043E27734F0277FCD2B45a968416EF", // Adresse de votre contrat
    abi: [
      {
        type: "function",
        name: "deposit",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
      },
    ],
    functionName: "deposit",
    value: weiValue, // Ajout de la valeur ETH ici
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <div className="w-4/5 pt-10 pl-56">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            write?.();
          }}
          className="bg-white shadow rounded border-2 px-8 pt-6 pb-8 mb-4"
        >
          {/* Champ pour le montant à déposer */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount (in ETH):
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {/* Bouton de soumission */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!write || isLoading}
          >
            {isLoading ? "Processing..." : "Deposit ETH"}
          </button>
          {/* Messages de statut */}
          <div className="mt-6 text-green-500">
            {isSuccess && (
              <div className="font-medium font-mono">Deposit successful!</div>
            )}
          </div>
          {(isPrepareError || isError) && (
            <div>Error: {(prepareError || error)?.message}</div>
          )}
        </form>
      </div>
      <div className="mt-8 border border-blue-400"></div>
    </>
  );
};

export default DepositForm;
