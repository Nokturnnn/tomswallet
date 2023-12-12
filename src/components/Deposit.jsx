import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "ethers";
import { useDebounce } from "use-debounce";

// Composant React pour le formulaire de dépôt d'Ether.
const DepositForm = () => {
  const [amount, setAmount] = useState(""); // État pour le montant à déposer.
  const [debouncedAmount] = useDebounce(amount, 500); // Débounce pour limiter les requêtes pendant la saisie.
  const [isAmountEmpty, setIsAmountEmpty] = useState(false); // État pour vérifier si le montant est vide.

  let weiValue;
  try {
    // Conversion du montant en wei (unité d'Ethereum).
    weiValue = parseEther(debouncedAmount || "0");
  } catch (error) {
    console.error("Erreur de conversion en wei:", error);
  }

  // Préparation de l'écriture du contrat pour le dépôt d'Ether.
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x6175e6985FCd3F643a73722725e2c8193347284E", // Adresse du contrat.
    abi: [
      {
        type: "function",
        name: "deposit",
        inputs: [],
        outputs: [],
        stateMutability: "payable", // Fonction payable pour accepter l'Ether.
      },
    ],
    functionName: "deposit",
    value: weiValue, // Valeur en Ether à déposer.
  });

  // Utilisation de useContractWrite pour écrire dans le contrat.
  const { data, error, isError, write } = useContractWrite(config);

  // Attente du résultat de la transaction.
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <>
      <div className="w-4/5 pt-10 pl-56">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!amount) {
              setIsAmountEmpty(true); // Défini l'erreur a true si le montant est vide
              return;
            }
            setIsAmountEmpty(false); // Réinitialise l'erreur si le montant est présent
            write?.();
          }}
          className="bg-white shadow rounded border-2 px-8 pt-6 pb-8"
        >
          {/* Champ pour le montant à déposer */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-4">
              Amount (in ETH) :
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount for example : 0.001"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {isAmountEmpty && (
              <p className="pt-5 text-red-500 font-medium font-mono">
                Please enter an amount !
              </p>
            )}
          </div>
          {/* Bouton de soumission */}
          <button
            className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!write || isLoading}
          >
            {isLoading ? "Processing..." : "Deposit ETH"}
          </button>
          <div className="mt-6 text-green-500">
            {/* Messages de statut */}
            {isSuccess && (
              <div className="font-medium font-mono">Deposit successful!</div>
            )}
          </div>
          <div className="text-red-400 font-bold font-mono">
            {(isPrepareError || isError) && (
              <div>Error: {(prepareError || error)?.message}</div>
            )}
          </div>
          {/* Bouton de soumission */}
        </form>
      </div>
      <div className="mt-8 border border-blue-400"></div>
    </>
  );
};

export default DepositForm;
