// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Déclaration du contrat MultiSigWallet
contract MultiSigWallet 
{
    // Déclaration des adresses publiques des deux utilisateurs (propriétaires) du wallet
    address public user1;
    address public user2;

    // Tableau dynamique pour stocker les transactions proposées
    Transaction[] public transactions;

    // Mapping pour suivre les approbations de chaque transaction par utilisateur
    mapping(uint256 => mapping(address => bool)) public approvals;

    // Structure de données pour représenter une transaction
    struct Transaction 
    {
        address to;     // Adresse destinataire de l'Ether
        uint value;     // Montant de l'Ether à envoyer
        bool executed;  // Statut d'exécution de la transaction
    }

    // Modifier pour restreindre l'accès aux seuls propriétaires du wallet
    modifier onlyOwner() 
    {
        require(msg.sender == user1 || msg.sender == user2, "Not an owner");
        _;
    }

    // Constructeur pour initialiser les adresses des deux utilisateurs lors de la création du contrat
    constructor(address _user1, address _user2) 
    {
        user1 = _user1;
        user2 = _user2;
    }

    // Fonction pour soumettre une nouvelle transaction par un des propriétaires
    function submitTransaction(address _to, uint _value) public onlyOwner 
    {
        uint txIndex = transactions.length; // Obtenir l'index de la nouvelle transaction
        transactions.push(Transaction({
            to: _to,
            value: _value,
            executed: false
        }));

        // Initialiser les approbations pour cette transaction à false
        approvals[txIndex][user1] = false;
        approvals[txIndex][user2] = false;
    }

    // Fonction permettant à un l'autre propriétaire d'approuver une transaction
    function approveTransaction(uint _txIndex) public onlyOwner 
    {
        require(!approvals[_txIndex][msg.sender], "Transaction already approved");
        approvals[_txIndex][msg.sender] = true; // Marquer la transaction comme approuvée par l'émetteur
    }

    // Fonction pour exécuter une transaction une fois qu'elle a été approuvée par les deux propriétaires
    function executeTransaction(uint _txIndex) public onlyOwner 
    {
        require(transactions[_txIndex].executed == false, "Transaction already executed");
        require(approvals[_txIndex][user1] && approvals[_txIndex][user2], "Transaction not approved by both owners");

        transactions[_txIndex].executed = true; // Marquer la transaction comme exécutée
        payable(transactions[_txIndex].to).transfer(transactions[_txIndex].value); // Transférer l'Ether au destinataire
    }

    // Fonction pour permettre au contrat de recevoir de l'Ether
    receive() external payable {}
}