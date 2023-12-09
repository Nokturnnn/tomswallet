// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    address[] public owners;
    uint public required;

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        mapping(address => bool) isConfirmed;
    }

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner(msg.sender), "Not an owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!transactions[_txIndex].isConfirmed[msg.sender], "Transaction already confirmed");
        _;
    }

    constructor(address owner1, address owner2, uint _required) {
        require(owner1 != address(0), "Invalid owner1");
        require(owner2 != address(0), "Invalid owner2");
        require(_required > 0 && _required <= 2, "Invalid required number of owners");

        owners.push(owner1);
        owners.push(owner2);

        required = _required;
    }

    function isOwner(address _address) public view returns (bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function submitTransaction(address _to, uint _value, bytes memory _data) public onlyOwner payable {
        uint txIndex = transactions.length;

        transactions.push(); // Ajoute une nouvelle transaction vide au tableau
        Transaction storage t = transactions[txIndex]; // Référence la nouvelle transaction
        t.to = _to; // Définit l'adresse destinataire
        t.value = _value; // Définit la valeur (en wei) à envoyer
        t.data = _data; // Définit les données de la transaction
        t.executed = false; // Marque la transaction comme non exécutée
    }

    function confirmTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        transaction.isConfirmed[msg.sender] = true;
    }

    function isConfirmed(uint _txIndex) public view returns (bool) {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (transactions[_txIndex].isConfirmed[owners[i]]) count++;
        }
        return (count >= required);
    }

    function executeTransaction(uint _txIndex) public txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed(_txIndex), "Cannot execute transaction");
        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transaction failed");
    }

    function deposit() external payable {}
}
