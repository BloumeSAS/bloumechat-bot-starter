# 📚 BloumeChat SDK - Comprehensive Documentation

Welcome to the full documentation for the **[bloumechat](https://www.npmjs.com/package/bloumechat)** SDK.  
This is the official framework to interact with the BloumeChat API, manage servers, channels, permissions, and listen to real-time events through WebSockets.

---

## 📥 Installation

Install the SDK via NPM or Yarn:

```bash
npm install bloumechat
# or
yarn add bloumechat
```

---

## 🚀 Quick Start

Here is a minimal snippet to connect your bot:

```typescript
import { BloumeChat } from "bloumechat";
import dotenv from "dotenv";

dotenv.config();

// Initialize the client
const client = new BloumeChat();

// Listen to the ready event when connection is established
client.on("ready", () => {
    console.log("✅ Bot successfully connected!");
});

// Listen for incoming messages
client.on("messageCreate", (message) => {
    if (message.content === "!ping") {
        message.reply("Pong! 🏓");
    }
});

// Authenticate using the Bot Token (obtainable from the BloumeChat Dev Portal)
client.login(process.env.BLOUMECHAT_TOKEN);
```

---

## 📡 The Client (`BloumeChat`)

The heart of the SDK is `BloumeChat`. It extends the standard Node.js `EventEmitter`.

### Methods
- `login(token: string)`: Initializes the WebSocket connection and authenticates the bot.
- `on(event: string, listener: Function)`: Continuously listen for an event.
- `once(event: string, listener: Function)`: Listen for an event only once.
- `getSocket()`: Returns the underlying Socket.IO instance.

### Events

The client fires the following events during lifecycle operations:

| Event | Description | Parameters |
| --- | --- | --- |
| `ready` | Fired when the WebSocket connects and bot is authenticated. | None |
| `messageCreate` | Fired on receiving a new message. | `message: Message` |
| `messageUpdate` | Fired when a message is edited. | `message: Message` |
| `messageDelete` | Fired when a message is deleted. | `data: { id: string }` |
| `messageReactionAdd` | Fired when an emoji reaction is added. | `data: Object` |
| `guildCreate` | Fired when the bot is added to a new server. | `guild: Guild` |
| `guildMemberAdd` | Fired when a new user joins a guild. | `member: Member` |
| `guildMemberUpdate` | Fired when a member's properties change (roles, nickname). | `data: Object` |
| `guildMemberRemove` | Fired when a user leaves or is kicked/banned. | `data: Object` |
| `guildChannelsUpdate` | Fired when the channel list changes (creation, deletion, etc.). | `data: Object` |
| `guildCategoriesUpdate` | Fired when the category list changes. | `data: Object` |
| `presenceUpdate` | Fired when a user's Online/Offline status changes. | `data: Object` |
| `disconnect` | Fired if the bot gets disconnected from the server. | `reason: string` |
| `error` | Fired for internal API/WebSocket errors. | `error: any` |

---

## 🏛️ Data Structures

### `Message`

Represents a sent message.

#### Properties:
- `id`: Unique external ID (Snowflake/PublicId).
- `content`: Text content string.
- `author`: Contains user data (`id`, `username`, etc.).
- `channelId`, `serverId`: Context identifiers.
- `guild`: Context `Guild` object (if cached internally).

#### Methods:
- `reply(content: string, embeds?: EmbedBuilder[])`: Quickly sends a reply in the same channel.
- `edit(content: string)`: Modifies the message (must be authored by the bot).
- `delete()`: Irreversibly deletes the message (requires `MANAGE_MESSAGES` or authored by the bot).
- `react(emoji: string)`: Casts an emoji reaction (requires `ADD_REACTION`).
- `fetchReactions(emoji: string)`: Retrieves users who reacted with the given emoji.
- `clearReactions()`: Strips all votes/reactions from the piece (requires `MANAGE_MESSAGES`).
- `awaitReactions(options: { max?: number, time?: number })`: Pauses execution waiting for inputs until `time` (ms) ends or `max` count is reached.
- `pin()`: Pins message to channel.
- `unpin()`: Unpins it.

### `Guild` (Server)

A server community environment managing roles, members, and channels.

#### Properties:
- `id`
- `name`, `description`, `iconUrl`, `bannerUrl`.

#### Management Methods (Subject to Role Permissions):
- **Channels:** `createChannel(options: { name: string, type: "TEXT" | "VOICE", isPrivate?: boolean, permissionOverwrites?: Array })`
- **Roles:** `createRole(options: { name: string, permissions?: bigint, color?: string, hoist?: boolean })`
- **Moderation:** `fetchBans()`, `unban(userId: string)`
- **Infos & Invites:** `fetchInvites()`, `createInvite({ maxAge, maxUses })`

### `Channel`

#### Methods:
- `send(content: string, embeds?: EmbedBuilder[])`: Post a new message.
- `fetchMessages(options?: { limit?: number, before?: string })`: View past history.
- `editPermissions(targetId: string, type: "ROLE" | "MEMBER", options: { allow: bigint, deny: bigint })`: Overrides global server permissions explicitly for this channel.

### `Role`

- `id`, `name`, `color`, `hoist` (separation in member list).
- `permissions`: A `BigInt` storing granted rights.
- `hasPermission(permission: bigint)`: Utility to check for a specific permission flag.
- `edit({...})` and `delete()`: Modifications.

---

## 🛡️ Permission System (`PermissionFlags`)

BloumeChat resolves permissions natively through **Bitwise Masks (`BigInt`)**.
The SDK exports `PermissionFlags` with all known permissions:

```typescript
import { PermissionFlags } from "bloumechat";

console.log(PermissionFlags.MANAGE_SERVER); // Retrieves the administrative flag value
```

### Roles and Permission Overwrites Workflow

```typescript
// Create a basic moderator role using bitwise "OR" (|) flag combining
const modRole = await message.guild.createRole({
    name: "Moderator",
    color: "#ff0000",
    permissions: PermissionFlags.VIEW_CHANNELS | PermissionFlags.SEND_MESSAGES | PermissionFlags.MANAGE_MESSAGES
});

// Deploying a private channel accessible only to the created Moderator role
await message.guild.createChannel({
    name: "Mod HQ",
    type: "TEXT",
    isPrivate: true, // Prevents @everyone base access
    permissionOverwrites: [{
        id: modRole.id,
        type: "ROLE",
        allow: PermissionFlags.VIEW_CHANNELS,
        deny: 0n // 0n BigInt (Don't explicitly deny anything)
    }]
});
```

---

## 🏗️ Utility Classes

### `EmbedBuilder`

Helps in formatting aesthetic message blocks.

```typescript
import { EmbedBuilder } from "bloumechat";

const myEmbed = new EmbedBuilder()
    .setTitle("🌟 SDK Tutorial")
    .setDescription("Rich texts go here!")
    .setColor("#5865F2")
    .addField({ name: "Why?", value: "It's stylish", inline: true })
    .setFooter({ text: "BloumeGen Docs" });

message.reply("Check this out:", [myEmbed]);
```

---

## 🤖 Example Bot Architecture

This repository comes with a fully functional example bot built with the BloumeChat SDK. Here's a breakdown of its structure:

### `index.ts` (Bot Core)
This is the application's entry point.
- Initializes the `BloumeChat` client.
- **Dynamically** loads all commands from the `commands/` directory into a `Map`.
- **Dynamically** loads all events from the `events/` directory.
- Logs into BloumeChat using the Token defined in the `.env` file (`process.env.BLOUMECHAT_TOKEN`).

### 📂 `events/` (Event Listeners)
- **`ready.ts`**: Explains connection establishment. It sets the bot's custom presence ("Watching your messages") and logs readiness.
- **`messageCreate.ts`**: Listens for any incoming messages. This acts as the **Command Handler**. If a message starts with `!`, it resolves the command from the collection and executes it, handling missing arguments and errors smoothly.

### 📂 `commands/` (Available Commands)
The bot includes various example commands to demonstrate the SDK's power:

- **`!avatar`**: Displays your user profile picture natively built into a neat Embed map.
- **`!ban [userId]`**: Bans a user. Demonstrates how to fetch a member using `client.members.fetch()` and trigger the `ban()` action.
- **`!clear [number]`**: Deletes up to 100 recent messages at once. Demonstrates checking user permissions (`MANAGE_MESSAGES`) dynamically and bulk-deleting with `channel.bulkDelete()`.
- **`!counter`**: A statistics counter utility command demonstration.
- **`!createchannel [name] [roleId?]`**: Shows how to deploy a private channel with specific overrides (`permissionOverwrites`).
- **`!createrole [name]`**: Demonstrates how to establish a role and grant authorities via bitmasks (`PermissionFlags`).
- **`!embed`**: Sends a rich embed card (titles, colors, fields, footers) leveraging the `EmbedBuilder`.
- **`!perms`**: Utility to test and modify target user permissions dynamically.
- **`!ping`**: A simple responsiveness test ("Pong!").
- **`!poll [question]`**: Demonstrates the flexibility of reactions. It posts a question, auto-reacts, halts execution via `awaitReactions`, tallies results, and wipes the reactions.
- **`!say [text]`**: The bot echoes the specified string and actively deletes the user's execution trigger.
- **`!serverinfo`**: Yields essential server identification aspects (name, ID, owner) formatted directly from cache.
- **`!stats`**: Yields operational bot metrics (server cache size, WebSocket connectivity, status).
- **`!suggest [idea]`**: Deletes the user's message and creates a beautifully formatted suggestion Embed with their username and profile picture, then automatically adds 👍 and 👎 reactions for community voting.
- **`!test`**: A loose command crafted for experimenting with SDK interactions.
- **`!ticket`**: Automatically fetches (or creates) a "Tickets" category using the SDK's Category features. Then, it generates a private text channel explicitly overwriting permissions so that only the command author and Administrators can view it. Finally, it pings the user inside.
- **`!userinfo`**: Produces a customized Embed displaying internal runtime traits about you (ID, Tag, Account type, status).

### 📂 `types/`
- **`index.ts`**: Contains the TypeScript `Command` interface to assure that all incoming commands cleanly align with the required standard schema (`name`, `description`, `execute`).
