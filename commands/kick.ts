import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "kick",
    description: "Expulse un membre du serveur.",
    aliases: ["expulser"],
    usage: "<@utilisateur|id> [raison]",
    examples: ["kick @User Comportement inapproprié", "kick abc123 Spam"],
    cooldown: 5,
    guildOnly: true,
    async execute({ client, message, args }: CommandContext) {
        if (!message.serverId) return;

        if (!args[0]) {
            await message.reply(`❌ Usage : \`!kick @utilisateur [raison]\``);
            return;
        }

        // Extract ID from mention <@id> / <@!id> or raw ID
        const userId = args[0].replace(/^<@!?/, "").replace(/>$/, "");
        if (!userId) {
            await message.reply("❌ Mention ou ID invalide.");
            return;
        }

        const reason = args.slice(1).join(" ") || "Aucune raison fournie";

        try {
            const socket = client.getSocket();
            if (!socket) throw new Error("Not connected");

            socket.emit("server:kick", {
                serverPublicId: message.serverId,
                userPublicId: userId,
                reason,
            });

            await message.reply(`✅ <@${userId}> a été expulsé. Raison : **${reason}**`);
        } catch {
            await message.reply("❌ Impossible d'expulser cet utilisateur (permissions manquantes ?).");
        }
    },
};

export default command;
