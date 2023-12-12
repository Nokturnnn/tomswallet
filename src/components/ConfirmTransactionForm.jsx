import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

// Composant React pour confirmer une transaction dans un contrat intelligent.
const ConfirmTransactionForm = () => {
  const [txIndex, setTxIndex] = useState(""); // État pour l'index de la transaction.
  const [isIndexEmpty, setIsIndexEmpty] = useState(false); // État pour vérifier si l'index est vide.

  // Préparation de l'écriture du contrat pour la confirmation de transaction.
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x6175e6985FCd3F643a73722725e2c8193347284E", // Adresse du contrat.
    abi: [
      // ABI du contrat avec la fonction à appeler.
      {
        type: "function",
        name: "confirmTransaction",
        inputs: [
          { name: "_txIndex", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "confirmTransaction", // Nom de la fonction à exécuter.
    args: [txIndex], // Arguments de la fonction (index de la transaction).
  });

  // Utilisation de useContractWrite pour écrire dans le contrat.
  const { data, error, isError, write } = useContractWrite(config);

  // Attente du résultat de la transaction.
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      {/* Barre de séparation */}
      <div className="mt-4 border border-blue-400"></div>
      {/* Barre de séparation */}
      <div className="w-4/5 pt-10 pl-56">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!txIndex) {
              setIsIndexEmpty(true); // Définir l'erreur si le montant est vide
              return;
            }
            setIsIndexEmpty(false); // Réinitialiser l'erreur si le montant est présent
            write?.();
          }}
          className="bg-white shadow rounded border-2 px-8 pt-6 pb-8"
        >
          {/* Champ de saisie pour l'index de la transaction */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-4">
              Transaction Index :
            </label>
            <input
              type="number"
              value={txIndex}
              onChange={(e) => setTxIndex(e.target.value)}
              placeholder="Enter Transaction Index for example : 0 / 1 / 2"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {isIndexEmpty && (
              <p className="pt-5 text-red-500 font-medium font-mono">
                Please enter an index !
              </p>
            )}
          </div>
          {/* Bouton de soumission */}
          <button
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!write || isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Transaction"}
          </button>
          <div className="mt-6 text-green-500">
            {/* Messages de statut */}
            {isSuccess && (
              <div className="font-medium font-mono">
                Confirm transaction successful!
              </div>
            )}
          </div>
          <div className="text-red-400 font-bold font-mono">
            {/* {(isPrepareError || isError) && (
              <div>Error: {(prepareError || error)?.message}</div>
            )} */}
          </div>
          {/* Bouton de soumission */}
        </form>
      </div>
    </>
  );
};

export default ConfirmTransactionForm;
