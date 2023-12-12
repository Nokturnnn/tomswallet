// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Un contrat intelligent pour un portefeuille multi-signatures. Ce contrat permet à plusieurs propriétaires d'approuver collectivement les transactions.
contract MultiSigWallet {
    // Mapping pour suivre les adresses qui sont propriétaires du portefeuille.
    mapping(address => bool) public isOwner;

    // Tableau dynamique pour stocker les adresses des propriétaires.
    address[] public owners;

    // Le nombre de confirmations requises pour qu'une transaction soit exécutée.
    uint public required;

    // Structure définissant les propriétés d'une transaction.
    struct Transaction {
        address to; // Adresse du destinataire de la transaction.
        uint value; // Montant d'Ether (en wei) à envoyer.
        bytes data; // Données supplémentaires avec la transaction.
        bool executed; // Statut pour vérifier si la transaction est exécutée.
        mapping(address => bool) isConfirmed; // Mapping pour suivre quels propriétaires ont confirmé la transaction.
    }

    // Tableau dynamique pour stocker les transactions.
    Transaction[] public transactions;

    // Événements pour enregistrer diverses actions dans le contrat.
    event Deposit(address indexed sender, uint amount);
    event Submission(uint indexed txIndex);
    event Confirmation(address indexed sender, uint indexed txIndex);
    event Execution(uint indexed txIndex);
    event Revocation(address indexed sender, uint indexed txIndex);

    // Modificateur pour restreindre l'accès à la fonction aux seuls propriétaires du portefeuille.
    modifier onlyOwner() {
        require(isOwner[msg.sender], "Pas un proprietaire");
        _;
    }

    // Modificateur pour vérifier si une transaction existe.
    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "La transaction n'existe pas");
        _;
    }

    // Modificateur pour s'assurer qu'une transaction n'a pas encore été exécutée.
    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "Transaction deja executee");
        _;
    }

    // Modificateur pour vérifier qu'une transaction n'est pas encore confirmée par msg.sender.
    modifier notConfirmed(uint _txIndex) {
        require(!transactions[_txIndex].isConfirmed[msg.sender], "Transaction deja confirmee");
        _;
    }

    // Constructeur pour configurer le portefeuille avec les propriétaires initiaux et le nombre de confirmations requises.
    constructor(address _owner1, address _owner2, uint _required) {
        require(_owner1 != address(0), "Proprietaire1 invalide");
        require(_owner2 != address(0), "Proprietaire2 invalide");
        require(_required > 0 && _required <= 2, "Nombre de confirmations requises invalide");

        isOwner[_owner1] = true;
        owners.push(_owner1);

        isOwner[_owner2] = true;
        owners.push(_owner2);

        required = _required;
    }

    // Fonction pour déposer de l'Ether dans le portefeuille. Émet un événement Deposit.
    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Fonction pour qu'un propriétaire soumette une transaction. Émet un événement Submission.
    function submitTransaction(address _to, uint _value, bytes memory _data) public onlyOwner {
        uint txIndex = transactions.length;

        transactions.push();
        Transaction storage t = transactions[txIndex];
        t.to = _to;
        t.value = _value;
        t.data = _data;
        t.executed = false;
        emit Submission(txIndex);
    }

    // Fonction pour qu'un propriétaire confirme une transaction. Vérifie les conditions avec les modificateurs.
    function confirmTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        transaction.isConfirmed[msg.sender] = true;

        emit Confirmation(msg.sender, _txIndex);
    }

    // Fonction pour exécuter une transaction après confirmation. Vérifie si la transaction a été suffisamment confirmée et n'est pas encore exécutée.
    function executeTransaction(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        require(_isConfirmed(_txIndex), "Impossible d'executer la transaction");

        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Echec de la transaction");

        emit Execution(_txIndex);
    }

    // Fonction permettant à un propriétaire de révoquer sa confirmation d'une transaction. Vérifie si la transaction est confirmée par msg.sender et n'est pas exécutée.
    function revokeConfirmation(uint _txIndex) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        require(transaction.isConfirmed[msg.sender], "Transaction non confirmee");

        transaction.isConfirmed[msg.sender] = false;
        emit Revocation(msg.sender, _txIndex);
    }

    // Fonction interne pour vérifier si une transaction a été suffisamment confirmée par les propriétaires.
    function _isConfirmed(uint _txIndex) private view returns (bool) {
        uint count = 0;
        for (uint i = 0; i < owners.length; i++) {
            if (transactions[_txIndex].isConfirmed[owners[i]]) {
                count += 1;
            }
        }
        return count >= required;
    }
}
