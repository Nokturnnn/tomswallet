# Multi-Signature Wallet Application

Ce projet est une application de portefeuille multi-signatures basée sur React et Ethereum. Elle permet aux utilisateurs de connecter leur portefeuille, de déposer des fonds, de soumettre, de confirmer, et d'exécuter des transactions via un contrat intelligent.
PS : Il y a encore des erreurs que je n'ai pas catch donc il y a des parties de mon code qui sont commentées mais vous retrouver plus en détails celles-ci en faisant F12.

## Installation

Pour installer et exécuter ce projet, suivez les étapes ci-dessous :

1. **Cloner le Répertoire** :
   * `git clone [url-du-repository]`
   * `cd [nom-du-dossier]`

3. **Installer les Dépendances** :
   * `npm install`

4. **Démarrer le Serveur de Développement** :
   * `npm run dev`
   * Cela lancera l'application en mode développement. Ouvrez `[http://localhost:3000]` pour la visualiser dans le navigateur.

## Composants de l'Application

### `WalletConnector`

- **Fonction** : Permet aux utilisateurs de connecter leur portefeuille Ethereum à l'application.
- **Bibliothèques Utilisées** : `wagmi` pour gérer la connexion et la déconnexion du portefeuille.
- **Spécificités** : Affiche des boutons pour connecter divers portefeuilles et un bouton pour se déconnecter une fois connecté.

### `TransactionForm`

- **Fonction** : Permet aux utilisateurs de soumettre une nouvelle transaction à signer par les autres co-propriétaires du portefeuille.
- **Bibliothèques Utilisées** : React pour la gestion d'état et `wagmi` pour les interactions avec les contrats.
- **Spécificités** : Formulaire pour entrer les détails de la transaction comme l'adresse du destinataire et le montant.

### `ConfirmTransactionForm`

- **Fonction** : Permet aux utilisateurs de confirmer une transaction soumise.
- **Bibliothèques Utilisées** : Utilise `wagmi` pour interagir avec le contrat intelligent.
- **Spécificités** : Formulaire pour entrer l'index de la transaction à confirmer.

### `Deposit`

- **Fonction** : Permet aux utilisateurs de déposer des fonds dans le portefeuille.
- **Bibliothèques Utilisées** : `wagmi` et `ethers` pour les transactions Ethereum.
- **Spécificités** : Champ pour saisir le montant à déposer en Ether.

### `ExecuteTransactionForm`

- **Fonction** : Permet l'exécution d'une transaction une fois qu'elle a été confirmée par le nombre requis de co-propriétaires.
- **Bibliothèques Utilisées** : Utilise `wagmi` pour les appels de contrat.
- **Spécificités** : Champ pour saisir l'index de la transaction à exécuter.

## Contribution

Les contributions, les issues et les demandes de fonctionnalités sont les bienvenues. N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence de `Moi`.
