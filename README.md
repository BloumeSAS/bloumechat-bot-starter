<p align="center">
  <img src="https://cdn.bloume.chat/favicon.ico" alt="BloumeChat Logo" width="150"/>
</p>

<h1 align="center">BloumeChat Bot Template v2</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/bloumechat"><img src="https://img.shields.io/npm/v/bloumechat.svg" alt="NPM Version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://bloumechat.com/developers"><img src="https://img.shields.io/badge/Portal-Développeurs-5865F2.svg" alt="Dev Portal" /></a>
</p>

Template de bot **BloumeChat** en TypeScript strict — architecture modulaire, cooldowns par commande, automod et support des alias.

---

## 🚀 Démarrage rapide

```bash
# 1. Cloner / copier ce répertoire
# 2. Installer les dépendances
npm install

# 3. Configurer le token
cp .env.sample .env
# → Éditer .env et renseigner BOT_TOKEN

# 4. Lancer le bot
npm start          # production (tsx)
npm run dev        # hot-reload (tsx watch)
npm run build      # compiler en JS (dist/)
npm run start:prod # exécuter le build
```

---

## 📁 Structure du projet

```
bloumechatbotexemple/
├── index.ts              ← Point d'entrée : charge commandes + events
├── types/
│   └── index.ts          ← Interfaces Command, BotEvent, CommandContext, BotConfig
├── util/
│   ├── logger.ts         ← Logger coloré avec timestamps
│   ├── cooldown.ts       ← CooldownManager (par commande + par utilisateur)
│   └── settings.ts       ← SettingsManager (JSON par serveur, persistant)
├── events/
│   ├── ready.ts          ← Connexion confirmée, présence initiale
│   ├── messageCreate.ts  ← Dispatcher de commandes (alias, cooldowns, guildOnly)
│   ├── automod.ts        ← Automodération (mots interdits, liens, caps)
│   ├── guildMemberAdd.ts ← Message de bienvenue
│   └── guildMemberRemove.ts ← Log de départ
└── commands/
    ├── help.ts           ← Liste des commandes / aide détaillée
    ├── ping.ts           ← Latence + uptime
    ├── stats.ts          ← Statistiques du bot
    ├── ban.ts            ← Bannir un membre
    ├── kick.ts           ← Expulser un membre
    ├── warn.ts           ← Avertir un membre
    ├── clear.ts          ← Supprimer des messages en masse
    ├── serverinfo.ts     ← Informations du serveur
    ├── userinfo.ts       ← Informations d'un utilisateur
    ├── embed.ts          ← Envoyer un embed personnalisé
    ├── poll.ts           ← Créer un sondage avec réactions
    ├── suggest.ts        ← Soumettre une suggestion
    └── say.ts            ← Faire parler le bot
```

---

## ⚙️ Ajouter une commande

Créez un fichier dans `commands/` qui exporte un objet `Command` :

```typescript
// commands/macommande.ts
import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "macommande",
    description: "Fait quelque chose d'utile.",
    aliases: ["mc"],           // optionnel
    usage: "<texte>",          // optionnel
    cooldown: 5,               // secondes
    guildOnly: true,           // optionnel
    async execute({ client, message, args, prefix }) {
        await message.reply(`Vous avez dit : ${args.join(" ")}`);
    },
};

export default command;
```

La commande est **automatiquement chargée** au démarrage — aucun import manuel requis.

---

## ⚙️ Ajouter un événement

```typescript
// events/monEvent.ts
import type { BotEvent } from "../types";

const event: BotEvent = {
    name: "presenceUpdate",
    once: false,
    async execute(client, data) {
        // ...
    },
};

export default event;
```

---

## 🔑 Variables d'environnement

| Variable     | Obligatoire | Défaut | Description                        |
|--------------|:-----------:|--------|------------------------------------|
| `BOT_TOKEN`  | ✅          | —      | Token du bot (portail développeurs)|
| `BOT_PREFIX` | ❌          | `!`    | Préfixe des commandes              |
| `OWNER_ID`   | ❌          | —      | Votre ID utilisateur               |

---

## 📖 Documentation SDK

La documentation complète du SDK `bloumechat` est disponible dans le dossier [`docs/`](./docs/).

* 🇫🇷 [Documentation en Français](./docs/README-fr.md)
* 🇬🇧 [Documentation in English](./docs/README-en.md)

---

<p align="center">Fait avec ❤️ par l'équipe BloumeChat</p>
