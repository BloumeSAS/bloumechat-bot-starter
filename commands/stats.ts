import type { Command, CommandContext } from "../types";
import { EmbedBuilder } from "bloumechat";

const command: Command = {
    name: "stats",
    description: "Affiche les statistiques du bot (mémoire, serveurs, uptime…).",
    aliases: ["info", "about", "botinfo"],
    cooldown: 10,
    async execute({ client, message }: CommandContext) {
        const mem   = process.memoryUsage();
        const memMB = (mem.heapUsed / 1_024 / 1_024).toFixed(1);

        const embed = new EmbedBuilder()
            .setTitle(`📊 Statistiques — ${client.user?.username}`)
            .setColor("#5865F2")
            .addFields(
                { name: "🌐 Serveurs",   value: `${client.guilds.cache.size}`,     inline: true },
                { name: "👥 Utilisateurs", value: `${client.users.cache.size}`,   inline: true },
                { name: "📢 Canaux",      value: `${client.channels.cache.size}`, inline: true },
                { name: "🧠 Mémoire",     value: `${memMB} MB`,                   inline: true },
                { name: "🟢 Node.js",     value: process.version,                 inline: true },
                {
                    name: "⏱ Uptime",
                    value: client.uptime != null ? formatUptime(client.uptime) : "—",
                    inline: true,
                }
            )
            .setTimestamp();

        if (client.user?.avatar) embed.setThumbnail(client.user.avatar);

        await message.reply({ embeds: [embed] });
    },
};

function formatUptime(ms: number): string {
    const s = Math.floor(ms / 1_000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}j ${h % 24}h ${m % 60}m`;
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

export default command;
