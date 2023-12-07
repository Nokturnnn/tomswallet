// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "ds-test/test.sol";
import "../src/contracts/MultiSigWallet.sol";

contract MultiSigWalletTest is DSTest {
    MultiSigWallet wallet;
    address owner1 = address(1);
    address owner2 = address(2);
    uint required = 2;

    function setUp() public {
        // Créer le wallet avec les propriétaires et le nombre de signatures requises
        wallet = new MultiSigWallet(owner1, owner2, required);
    }

    function testInitialSetup() public {
        // Vérifier les propriétaires et le nombre requis de signatures
        assertTrue(wallet.isOwner(owner1));
        assertTrue(wallet.isOwner(owner2));
        assertEq(wallet.required(), required);
    }

    function testSubmitAndConfirmTransaction() public {
        // Soumettre une transaction
        (bool successSubmit, ) = owner1.call(
            abi.encodeWithSelector(
                wallet.submitTransaction.selector,
                address(this),
                100,
                ""
            )
        );
        assertTrue(successSubmit);

        // Confirmer la transaction par le premier propriétaire
        (bool successConfirm1, ) = owner1.call(
            abi.encodeWithSelector(
                wallet.confirmTransaction.selector,
                0
            )
        );
        assertTrue(successConfirm1);

        // Confirmer la transaction par le second propriétaire
        (bool successConfirm2, ) = owner2.call(
            abi.encodeWithSelector(
                wallet.confirmTransaction.selector,
                0
            )
        );
        assertTrue(successConfirm2);

        // Vérifier que la transaction a été exécutée
        (bool successExecute, ) = owner1.call(
            abi.encodeWithSelector(
                wallet.executeTransaction.selector,
                0
            )
        );
        assertTrue(successExecute);
    }
}
