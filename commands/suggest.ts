import type { Command, CommandContext } from "../types";
import { EmbedBuilder } from "bloumechat";

const command: Command = {
    name: "suggest",
    description: "Soumet une suggestion au serveur (canal #suggestions automatique).",
    aliases: ["suggestion", "idée"],
    usage: "<message>",
    examples: ["suggest Ajouter un salon musique", "suggest Bot pour les tickets de support"],
    cooldown: 60,
    guildOnly: true,
    async execute({ client, message, args }: CommandContext) {
        if (!message.serverId) return;

        if (args.length === 0) {
            await message.reply("❌ Veuillez fournir une suggestion. Exemple : `!suggest Ajouter un salon musique`");
            return;
        }

        const text = args.join(" ").substring(0, 2_000);

        const embed = new EmbedBuilder()
            .setTitle("💡 Nouvelle suggestion")
            .setDescription(text)
            .setColor("#57F287")
            .setAuthor({
                name:    message.author.username,
                iconUrl: message.author.avatar ?? undefined,
            })
            .setFooter({ text: "Votez avec 👍 ou 👎" })
            .setTimestamp();

        // Find a #suggestions channel, fall back to current channel
        const suggestChannel = client.channels.cache.find(
            c => c.serverId === message.serverId &&
                 c.type === "TEXT" &&
                 c.name?.toLowerCase().includes("suggest")
        ) ?? message.channel;

        const posted = await client.sendMessage(suggestChannel.id, { embeds: [embed] });

        // Add vote reactions
        await posted.react("👍").catch(() => {});
        await posted.react("👎").catch(() => {});

        // If we redirected to another channel, confirm
        if (suggestChannel.id !== message.channelId) {
            await message.reply(`✅ Votre suggestion a été envoyée dans <#${suggestChannel.id}> !`);
        }

        // Clean up the command message
        await message.delete().catch(() => {});
    },
};

export default command;
