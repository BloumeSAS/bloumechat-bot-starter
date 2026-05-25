import type { BloumeChat } from "bloumechat";
import { EmbedBuilder } from "bloumechat";
import type { BotEvent } from "../types";
import { logger } from "../util/logger";

const event: BotEvent = {
    name: "guildMemberAdd",
    async execute(client: BloumeChat, data: any) {
        const guildId: string = data.serverPublicId ?? data.serverId;
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return;

        const user = data.user ?? data;
        const username: string = user.name ?? user.username ?? "Nouvel utilisateur";
        const userId: string   = user.publicId ?? user.id ?? "";

        logger.info(`${username} joined ${guild.name}`);

        // Try to find the first text channel in the guild
        await guild.fetchChannels().catch(() => {});
        const channel = client.channels.cache.find(
            c => c.serverId === guild.id && c.type === "TEXT"
        );
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle(`👋 Bienvenue sur ${guild.name} !`)
            .setDescription(
                `Bienvenue ${userId ? `<@${userId}>` : `**${username}**`} !\nNous sommes ravis de vous accueillir.`
            )
            .addFields(
                { name: "👤 Membre", value: userId ? `<@${userId}>` : username, inline: true },
                { name: "🔢 Membres", value: `${(guild as any).memberCount ?? "?"}`, inline: true }
            )
            .setColor("#2ECC71")
            .setTimestamp();

        if (user.image ?? user.avatar) {
            embed.setThumbnail(user.image ?? user.avatar);
        }

        await client.sendMessage(channel.id, { embeds: [embed] }).catch((err) => {
            logger.error(`Failed to send welcome message in ${guild.name}:`, err);
        });
    },
};

export default event;
