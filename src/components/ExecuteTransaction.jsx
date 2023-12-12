import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

// Composant React pour exécuter une transaction dans un contrat intelligent.
const ExecuteTransaction = () => {
  const [txIndex, setTxIndex] = useState(""); // État pour stocker l'index de la transaction.

  // Gère la modification de l'index de transaction.
  const onChange = (e) => {
    setTxIndex(e.target.value);
  };

  // Utilise le hook usePrepareContractWrite de wagmi pour préparer l'écriture du contrat.
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
        name: "executeTransaction",
        inputs: [
          { name: "_txIndex", type: "uint256", internalType: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "executeTransaction", // Nom de la fonction à exécuter.
    args: [txIndex], // Arguments de la fonction (index de la transaction).
  });

  // Utilise le hook useContractWrite de wagmi pour écrire dans le contrat.
  const { data, error, isError, write } = useContractWrite(config);

  // Utilise le hook useWaitForTransaction de wagmi pour attendre la transaction.
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  // Gère la soumission du formulaire.
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
          {/* Champ de saisie pour l'index de la transaction */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Index de la transaction :
            </label>
            <input
              type="number"
              value={txIndex}
              onChange={onChange}
              placeholder="Entrez l'index de la transaction"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Bouton pour soumettre la transaction */}
          <button
            className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!write || isLoading}
          >
            {isLoading ? "Processing..." : "Exécuter la transaction"}
          </button>
          <div className="mt-6 text-green-500">
            {/* Affiche un message de succès si la transaction est réussie */}
            {isSuccess && (
              <div className="font-medium font-mono">
                The transaction was successfully executed !
              </div>
            )}
          </div>
          <div className="text-red-400 font-bold font-mono">
            {/* Affiche un message d'erreur en cas d'échec */}
            {/* {(isPrepareError || isError) && (
              <div>Erreur : {(prepareError || error)?.message}</div>
            )} */}
          </div>
        </form>
      </div>
    </>
  );
};

export default ExecuteTransaction;
