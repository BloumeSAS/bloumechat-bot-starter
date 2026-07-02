import type { Command, CommandContext } from "../types";
import { EmbedBuilder } from "bloumechat";

const command: Command = {
    name: "serverinfo",
    description: "Affiche les informations du serveur actuel.",
    aliases: ["guildinfo", "si", "server"],
    cooldown: 10,
    guildOnly: true,
    async execute({ client, message }: CommandContext) {
        if (!message.serverId) return;

        const guild = client.guilds.cache.get(message.serverId);
        if (!guild) {
            await message.reply("❌ Impossible de récupérer les informations du serveur.");
            return;
        }

        // Refresh channel count
        await guild.fetchChannels().catch(() => {});
        const channelCount = client.channels.cache.filter(c => c.serverId === guild.id).size;

        const embed = new EmbedBuilder()
            .setTitle(`🏠 ${guild.name}`)
            .setColor("#5865F2")
            .addFields(
                { name: "👑 Propriétaire",  value: `<@${guild.ownerId}>`, inline: true },
                { name: "👥 Membres",       value: `${guild.memberCount ?? "?"}`, inline: true },
                { name: "📢 Canaux",        value: `${channelCount}`,      inline: true },
                { name: "🆔 ID Serveur",    value: `\`${guild.id}\``,      inline: false }
            )
            .setTimestamp();

        if (guild.icon) embed.setThumbnail(guild.icon);

        await message.reply({ embeds: [embed] });
    },
};

export default command;
