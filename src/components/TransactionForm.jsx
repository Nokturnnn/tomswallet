import * as React from "react";
import { useState } from "react";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "ethers";
import { useDebounce } from "use-debounce";

const TransactionForm = () => {
  // Déclaration des variables d'état
  const [to, setTo] = React.useState("");
  const [debouncedTo] = useDebounce(to, 500);
  const [value, setValue] = React.useState("");
  const [debouncedAmount] = useDebounce(value, 500);
  const [_data, setData] = useState("");

  // console.log("Valeur entrée (ETH):", value);
  // console.log("Valeur debouncée (ETH):", debouncedAmount);

  let weiValue;
  try {
    weiValue = parseEther(debouncedAmount || "0"); // Modification pour gérer les valeurs vides
    // console.log("Valeur convertie en wei:", weiValue.toString());
  } catch (error) {
    // console.error("Erreur de conversion en wei:", error);
  }

  // Préparation de l'écriture du contrat
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: "0x0a8439FA04043E27734F0277FCD2B45a968416EF",
    abi: [
      {
        type: "function",
        name: "submitTransaction",
        inputs: [
          { name: "_to", type: "address", internalType: "address" },
          { name: "_value", type: "uint256", internalType: "uint256" },
          { name: "_data", type: "bytes", internalType: "bytes" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    functionName: "submitTransaction",
    args: [debouncedTo, "0", _data], // Passage à '0' pour le montant _value
    value: weiValue, // Ajout de la valeur ETH ici
  });

  // console.log(
  //   "Arguments de la transaction:",
  //   debouncedTo,
  //   weiValue.toString(),
  //   _data
  // );

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div className="w-4/5 pt-10 pl-56">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
        className="bg-white shadow rounded border-2 px-8 pt-6 pb-8 mb-4"
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

        {/* Champ pour _data */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Data (bytes):
          </label>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter data"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex flex-col items-center justify-between">
          {/* Submit Button */}
          <button
            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={!write || isLoading}
          >
            {isLoading ? "Processing..." : "Submit Transaction"}
          </button>
          <div className="mt-6 text-green-500">
            {/* Success Message */}
            {isSuccess && (
              <div className="font-medium font-mono">
                Transaction successful!
              </div>
            )}
          </div>
          {/* Error Message */}
          {(isPrepareError || isError) && (
            <div>Error: {(prepareError || error)?.message}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
