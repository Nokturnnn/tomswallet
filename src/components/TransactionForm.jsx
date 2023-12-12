import React, { useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "ethers";
import { useDebounce } from "use-debounce";

const TransactionForm = () => {
  // Déclaration des variables d'état
  const [to, setTo] = useState(""); // État pour l'adresse de destination
  const [value, setValue] = useState(""); // État pour la valeur en ETH
  const [_data, setData] = useState(""); // État pour les données

  const [debouncedTo] = useDebounce(to, 500); // Utilisation de la fonction de debounce pour l'adresse
  const [debouncedAmount] = useDebounce(value, 500); // Utilisation de la fonction de debounce pour la valeur

  let weiValue;
  try {
    weiValue = parseEther(debouncedAmount || "0"); // Conversion de la valeur en ETH en wei
  } catch (error) {
    console.error("Erreur de conversion en wei:", error);
  }

  // Préparation de l'écriture du contrat
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x6175e6985FCd3F643a73722725e2c8193347284E", // Adresse du contrat
    abi: [
      {
        type: "function",
        name: "submitTransaction",
        inputs: [
          { name: "_to", type: "address", internalType: "address" }, // Adresse du destinataire
          { name: "_value", type: "uint256", internalType: "uint256" }, // Montant en ETH à envoyer
          { name: "_data", type: "bytes", internalType: "bytes" }, // Mettre OxO par exemple
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "submitTransaction",
    args: [debouncedTo, weiValue, _data], // Arguments pour la fonction du contrat
  });

  const { data, error, isError, write } = useContractWrite(config); // Utilisation de useContractWrite pour effectuer l'écriture du contrat

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash, // Attente de la transaction en cours
  });

  return (
    <div className="w-4/5 pt-10 pl-56">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.(); // Soumettre la transaction
        }}
        className="bg-white shadow rounded border-2 px-8 pt-6 pb-8 mb-8"
      >
        {/* Champ pour _to */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Address:
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* Champ pour _to */}

        {/* Champ pour _value */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Value (in ETH):
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* Champ pour _value */}

        {/* Champ pour _data */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Data (bytes):
          </label>
          <input
            type="text"
            value={_data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter data"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* Champ pour _data */}

        {/* Bouton de soumission */}
        <div className="flex flex-col items-center justify-between">
          <button
            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!write || isLoading}
          >
            {isLoading ? "Processing..." : "Submit Transaction"}
          </button>
          <div className="mt-6 text-green-500">
            {/* Message de succès */}
            {isSuccess && (
              <div className="font-medium font-mono">
                Transaction successful!
              </div>
            )}
          </div>
          {/* Message d'erreur */}
          {/* {(isPrepareError || isError) && (
            <div>Error: {(prepareError || error)?.message}</div>
          )} */}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
