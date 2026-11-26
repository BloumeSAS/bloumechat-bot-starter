
---

## 🤖 Structure du Bot d'Exemple

Le dossier de ce projet contient un bot Discord-like entièrement fonctionnel créé avec le SDK BloumeChat. Voici son architecture :

### `index.ts` (Cœur du Bot)
C'est le point d'entrée de l'application.
- Il initialise le client `@bloume/chat`.
- Il charge **dynamiquement** toutes les commandes depuis le dossier `commands/` dans une `Map`.
- Il charge **dynamiquement** tous les événements depuis le dossier `events/`.
- Il se connecte à BloumeChat en utilisant le Token défini dans le fichier `.env` (`process.env.BLOUMECHAT_TOKEN`).

### 📂 `events/` (Gestionnaires d'Événements)
- **`ready.ts`** : S'exécute lorsque le bot est correctement connecté à l'API. Il affiche le pseudo du bot et définit un statut ("Regarde vos messages").
- **`messageCreate.ts`** : Écoute tous les messages entrants. C'est ici que se trouve le **Command Handler**. Si un message commence par le préfixe `!`, il cherche la commande correspondante dans la collection et l'exécute, tout en gérant les erreurs.

### 📂 `commands/` (Commandes Disponibles)
Le bot inclut plusieurs commandes exemples pour démontrer la puissance du SDK :

- **`!ban [userId]`** : Banni un membre du serveur. Démontre l'utilisation de `client.members.fetch()` et la méthode d'action `ban()`.
- **`!clear [nombre]`** : Supprime de 1 à 100 messages d'un coup. Démontre la vérification dynamique de permissions (via les accès `MANAGE_MESSAGES`) et `channel.bulkDelete()`.
- **`!counter`** : Crée généralement un système de compteur (affichage d'une statistique du serveur via une description). 
- **`!createchannel [nom] [roleId?]`** : Démontre la création d'un salon avec des permissions spécifiques (`permissionOverwrites`).
- **`!createrole [nom]`** : Démontre la création de rôle et comment attribuer des droits via les bitmasks (`PermissionFlags`).
- **`!embed`** : Envoie un message formaté avec un Embed (titres, couleurs, bordures, description) via `EmbedBuilder`.
- **`!perms`** : Permet de manipuler ou tester le système de permissions d'un utilisateur cible.
- **`!ping`** : Une simple commande de test ("Pong!").
- **`!poll [question]`** : Démontre la flexibilité des réactions. Le bot pose une question, ajoute des réactions automatiquement, attend les réponses avec `awaitReactions` puis affiche les résultats.
- **`!stats`** : Affiche les statistiques basiques du bot (nombre de serveurs, latence WebSocket, statut).
- **`!test`** : Commande fourre-tout pour tester l'envoi de requêtes manuellement.

### 📂 `types/`
- **`index.ts`** : Définit l'interface TypeSript (ex: `Command`) pour s'assurer que toutes les commandes créées respectent ce schéma (`name`, `description`, `execute`).
