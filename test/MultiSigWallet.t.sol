// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "ds-test/test.sol";
import "../src/contracts/MultiSigWallet.sol";
import "forge-std/Vm.sol";

contract MultiSigWalletTest is DSTest {
    Vm vm = Vm(HEVM_ADDRESS);  // Instance du Virtual Machine (VM) pour simuler des transactions.
    MultiSigWallet wallet;    // Instance du contrat MultiSigWallet.
    address user1;           // Adresse du premier propriétaire.
    address user2;          // Adresse du deuxième propriétaire.

    // Fonction d'installation exécutée avant chaque test.
    function setUp() public {
        user1 = address(0x123); // Initialiser user1 avec une adresse factice.
        user2 = address(0x456); // Initialiser user2 avec une autre adresse factice.
        wallet = new MultiSigWallet(user1, user2); // Créer une nouvelle instance du contrat MultiSigWallet.
        // Envoyer de l'Ether au contrat pour couvrir la transaction testée.
        payable(address(wallet)).transfer(1 ether);
    }

    // Test pour vérifier si les propriétaires initiaux sont correctement définis.
    function testInitialOwners() public {
        assertEq(wallet.user1(), user1); // Vérifier si user1 est correctement défini.
        assertEq(wallet.user2(), user2); // Vérifier si user2 est correctement défini.
    }

    // Test pour vérifier la capacité du contrat à recevoir de l'Ether.
    function testReceiveEther() public {
        // Vérifier si le solde du contrat est égal à 1 Ether.
        assertEq(address(wallet).balance, 1 ether);
    }

    // Test pour vérifier le processus de soumission, d'approbation et d'exécution d'une transaction.
    function testSubmitAndApproveTransaction() public {
        // Simuler l'action de user1 pour soumettre la transaction.
        vm.prank(user1);
        wallet.submitTransaction(address(0x789), 0.5 ether);

        // Simuler l'action de user1 pour approuver la transaction.
        vm.prank(user1);
        wallet.approveTransaction(0);

        // Simuler l'action de user2 pour également approuver la transaction.
        vm.prank(user2);
        wallet.approveTransaction(0);

        // Vérifier que la transaction a été approuvée par les deux propriétaires.
        bool isApprovedByUser1 = wallet.approvals(0, user1);
        bool isApprovedByUser2 = wallet.approvals(0, user2);
        assertTrue(isApprovedByUser1 && isApprovedByUser2);

        // Exécuter la transaction.
        vm.prank(user1);
        wallet.executeTransaction(0);

        // Vérifier si la transaction a été correctement exécutée.
        (, , bool executed) = wallet.transactions(0);
        assertTrue(executed);
    }

    // Fonction pour permettre au contrat de tester de recevoir de l'Ether.
    receive() external payable {}
}
