# 📚 BloumeChat SDK - Documentation Complète

Bienvenue dans la documentation complète du SDK **[bloumechat](https://www.npmjs.com/package/bloumechat)**.  
Ce SDK est l'outil officiel pour interagir avec l'API BloumeChat, gérer vos serveurs, vos canaux, vos permissions et écouter les événements en temps réel via des WebSockets.

---

## 📥 Installation

Pour installer le SDK, utilisez NPM ou Yarn :

```bash
npm install bloumechat
# ou
yarn add bloumechat
```

---

## 🚀 Démarrage Rapide

Voici un exemple minimal pour connecter votre bot :

```typescript
import { BloumeChat } from "bloumechat";
import dotenv from "dotenv";

dotenv.config();

// Initialise le client
const client = new BloumeChat();

// Écoute l'événement de connexion réussie
client.on("ready", () => {
    console.log("✅ Bot connecté avec succès !");
});

// Écoute les nouveaux messages
client.on("messageCreate", (message) => {
    if (message.content === "!ping") {
        message.reply("Pong! 🏓");
    }
});

// Connecte le bot avec son Token (à obtenir sur le portail développeur BloumeChat)
client.login(process.env.BLOUMECHAT_TOKEN);
```

---

## 📡 Le Client (`BloumeChat`)

La classe principale du SDK est `BloumeChat`. Elle étend un `EventEmitter` standard.

### Méthodes
- `login(token: string)`: Initialise la connexion WebSocket avec BloumeChat en utilisant le Token d'authentification du Bot.
- `on(event: string, listener: Function)`: Écoute de manière continue un événement.
- `once(event: string, listener: Function)`: Écoute un événement une seule fois.
- `getSocket()`: Retourne l'instance Socket.IO sous-jacente.

### Événements

Le client émet plusieurs événements :

| Événement | Description | Paramètres |
| --- | --- | --- |
| `ready` | Déclenché lorsque la connexion WebSocket est établie et authentifiée. | Aucun |
| `messageCreate` | Déclenché lorsqu'un nouveau message est reçu. | `message: Message` |
| `messageUpdate` | Déclenché lorsqu'un message existant est modifié. | `message: Message` |
| `messageDelete` | Déclenché lorsqu'un message est supprimé. | `data: { id: string }` |
| `messageReactionAdd` | Déclenché lorsqu'une réaction est ajoutée. | `data: Object` |
| `guildMemberAdd` | Déclenché lorsqu'un nouvel utilisateur rejoint un serveur. | `data: Object` |
| `guildMemberUpdate` | Déclenché lorsqu'un membre d'un serveur est mis à jour (rôles, pseudo). | `data: Object` |
| `guildMemberRemove` | Déclenché lorsqu'un utilisateur quitte ou est expulsé d'un serveur. | `data: Object` |
| `guildChannelsUpdate` | Déclenché lors de la modification de la liste des salons (création, suppression, etc.). | `data: Object` |
| `guildCategoriesUpdate` | Déclenché lors de la modification de la liste des catégories. | `data: Object` |
| `presenceUpdate` | Déclenché lorsque le statut "En ligne/Hors ligne" d'un membre change. | `data: Object` |
| `disconnect` | Déclenché si la connexion au serveur WebSocket est perdue. | `reason: string` |
| `error` | Déclenché lors d'erreurs de connexion ou d'exécution d'API. | `error: any` |

---

## 🏛️ Les Structures

### `Message`

Représente un message envoyé sur BloumeChat.

#### Propriétés communes :
- `id` : L'identifiant externe unique du message (Snowflake/PublicId).
- `content` : Le contenu texte du message.
- `author` : Un objet contenant les infos de l'auteur (`id`, `username`, etc.).
- `channelId`, `serverId` : Identifiants du salon et du serveur de ce message.
- `guild` : Objet optionnel `Guild` (si mis en cache dans le SDK).

#### Méthodes :
- `reply(content: string, embeds?: EmbedBuilder[])`: Envoie une réponse dans le même salon.
- `edit(content: string)`: Modifie le texte de ce message (nécessite que le bot soit l'auteur).
- `delete()`: Supprime le message de façon permanente (nécessite `MANAGE_MESSAGES` ou d'en être l'auteur).
- `react(emoji: string)`: Ajoute une réaction Emoji à ce message (nécessite `ADD_REACTION`).
- `fetchReactions(emoji: string)`: Récupère la liste des id et noms des membres ayant cliqué sur une réaction donnée.
- `clearReactions()`: Supprime la totalité des réactions du message (nécessite `MANAGE_MESSAGES`).
- `awaitReactions(options: { max?: number, time?: number })`: Suspend l'exécution et renvoie les réactions reçues dans la limite d'un délai `time` (ms) ou d'un maximum `max` de clics.
- `pin()`: Épingle le message dans le salon (nécessite `MANAGE_MESSAGES`).
- `unpin()`: Désépingle le message (nécessite `MANAGE_MESSAGES`).

### `Guild` (Serveur)

Un serveur contenant des rôles, des salons et des membres.

#### Propriétés :
- `id` : L'ID public du serveur.
- `name` : Nom du serveur.
- `description`, `iconUrl`, `bannerUrl`.

#### Méthodes de Gestions (Nécessitent des permissions précises, cf partie Permissions) :
- **Canaux :** `createChannel(options: { name: string, type: "TEXT" | "VOICE", isPrivate?: boolean, permissionOverwrites?: Array })`
- **Rôles :** `createRole(options: { name: string, permissions?: bigint, color?: string, hoist?: boolean })`
- **Modération :** `fetchBans()`, `unban(userId: string)`
- **Infos & Invites :** `fetchInvites()`, `createInvite({ maxAge, maxUses })`

### `Channel` (Salon)

#### Méthodes :
- `send(content: string, embeds?: EmbedBuilder[])`: Envoie un message dans ce salon (nécessite `SEND_MESSAGES`).
- `fetchMessages(options?: { limit?: number, before?: string })`: Récupère l'historique des derniers messages.
- `editPermissions(targetId: string, type: "ROLE" | "MEMBER", options: { allow: bigint, deny: bigint })`: Gère qui a la permission de voir `/` écrire spécifiquement dans ce salon en surchargeant les permissions Serveur.

### `Role`

- `id`: ID du rôle.
- `name`, `color`, `hoist` (affichage séparé).
- `permissions`: Un `BigInt` contenant les accès bitwise.
- `hasPermission(permission: bigint)`: Méthode pratique pour savoir si ce rôle possède un flag `PermissionFlags` précis.
- `edit({...})` et `delete()`: Pour modifier ou détruire un rôle.

---

## 🛡️ Les Permissions (`PermissionFlags`)

Le système de permissions de BloumeChat fonctionne en **Masque de Bits (Bitmask)** via un `BigInt`.
Le SDK fournit un enum utile contenant toutes les permissions brutes du serveur :

```typescript
import { PermissionFlags } from "bloumechat";

console.log(PermissionFlags.MANAGE_SERVER); // Affiche la valeur de l'accès Administrateur Serveur
```

### Exemple de Création de Rôle ou Cannel avec Permissions

```typescript
const monNouveauRole = await message.guild.createRole({
    name: "Gardien",
    color: "#ff0000",
    // Assemblage de permissions avec l'opérateur "OU" logique (|)
    permissions: PermissionFlags.VIEW_CHANNELS | PermissionFlags.SEND_MESSAGES | PermissionFlags.MANAGE_MESSAGES
});

await message.guild.createChannel({
    name: "QG Gardiens",
    type: "TEXT",
    isPrivate: true, // Le Cannel ne sera pas visible par `@everyone`
    permissionOverwrites: [{
        id: monNouveauRole.id,
        type: "ROLE",
        allow: PermissionFlags.VIEW_CHANNELS,
        deny: 0n // 0 BigInt, on n'interdit rien explicitement
    }]
});
```

---

## 🏗️ Outils Pratiques

### `EmbedBuilder`

Construit des messages visuellement enrichis (Embeds) à insérer dans des actions `reply()` ou `send()`.

```typescript
import { EmbedBuilder } from "bloumechat";

const monEmbed = new EmbedBuilder()
    .setTitle("🌟 Bienvenue dans la doc")
    .setDescription("Texte formaté ici")
    .setColor("#5865F2")
    .addField({ name: "Raison", value: "Exemple SDK", inline: true })
    .setFooter({ text: "Bot par BloumeGen" });

message.reply("Regarde cet embed :", [monEmbed]);
```

---

## 🤖 Structure du Bot d'Exemple

Le dossier de ce projet contient un bot Discord-like entièrement fonctionnel créé avec le SDK BloumeChat. Voici son architecture :

### `index.ts` (Cœur du Bot)
C'est le point d'entrée de l'application.
- Il initialise le client `BloumeChat`.
- Il charge **dynamiquement** toutes les commandes depuis le dossier `commands/` dans une `Map`.
- Il charge **dynamiquement** tous les événements depuis le dossier `events/`.
- Il se connecte à BloumeChat en utilisant le Token défini dans le fichier `.env` (`process.env.BLOUMECHAT_TOKEN`).

### 📂 `events/` (Gestionnaires d'Événements)
- **`ready.ts`** : S'exécute lorsque le bot est correctement connecté à l'API. Il affiche le pseudo du bot et définit un statut ("Regarde vos messages").
- **`messageCreate.ts`** : Écoute tous les messages entrants. C'est ici que se trouve le **Command Handler**. Si un message commence par le préfixe `!`, il cherche la commande correspondante dans la collection et l'exécute, tout en gérant les erreurs.

### 📂 `commands/` (Commandes Disponibles)
Le bot inclut plusieurs commandes exemples pour démontrer la puissance du SDK :

- **`!avatar`** : Affiche votre photo de profil en grand format grâce au constructeur d'Embed.
- **`!ban [userId]`** : Banni un membre du serveur. Démontre l'utilisation de `client.members.fetch()` et la méthode d'action `ban()`.
- **`!clear [nombre]`** : Supprime de 1 à 100 messages d'un coup. Démontre la vérification dynamique de permissions (via les accès `MANAGE_MESSAGES`) et `channel.bulkDelete()`.
- **`!counter`** : Système de compteur pour le serveur.
- **`!createchannel [nom] [roleId?]`** : Démontre la création d'un salon avec des permissions spécifiques (`permissionOverwrites`).
- **`!createrole [nom]`** : Démontre la création de rôle et comment attribuer des droits via les bitmasks (`PermissionFlags`).
- **`!embed`** : Envoie un message formaté avec un Embed (titres, couleurs, bordures, description) via `EmbedBuilder`.
- **`!perms`** : Permet de manipuler ou tester le système de permissions d'un utilisateur cible.
- **`!ping`** : Une simple commande de test ("Pong !").
- **`!poll [question]`** : Démontre la flexibilité des réactions. Le bot pose une question, ajoute des réactions automatiquement, attend les réponses avec `awaitReactions` puis affiche les résultats.
- **`!say [texte]`** : Fait répéter au bot la phrase indiquée et efface votre message initial.
- **`!serverinfo`** : Rassemble et affiche les informations du serveur actuel (nom, ID du serveur, propriétaire).
- **`!stats`** : Affiche les statistiques basiques du bot (nombre de serveurs, latence WebSocket, statut).
- **`!suggest [idée]`** : Supprime le message de l'utilisateur et crée un magnifique Embed de suggestion avec son pseudo et sa photo de profil, puis ajoute automatiquement les réactions 👍 et 👎.
- **`!test`** : Commande pour tester l'envoi de divers événements au SDK.
- **`!ticket`** : Recherche (ou crée automatiquement) une catégorie "Tickets" via `fetchCategories` et `createCategory`, puis crée un salon privé individuel pour l'utilisateur en ne l'autorisant que lui et les administrateurs à le voir grâce aux `permissionOverwrites`. Le bot le tag alors à l'intérieur.
- **`!userinfo`** : Affiche vos propres informations d'utilisateur BloumeChat (Tag, ID, type de compte, statut) sous forme d'Embed.

### 📂 `types/`
- **`index.ts`** : Importation de l'interface TypeSript `Command` pour s'assurer que toutes les commandes créées respectent ce schéma (`name`, `description`, `execute`).
