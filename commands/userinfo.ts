import type { Command, CommandContext } from "../types";
import { EmbedBuilder } from "bloumechat";

const command: Command = {
    name: "userinfo",
    description: "Affiche les informations d'un utilisateur (vous par défaut).",
    aliases: ["whois", "ui", "user"],
    usage: "[@utilisateur|id]",
    examples: ["userinfo", "userinfo @User", "userinfo abc123"],
    cooldown: 5,
    async execute({ client, message, args }: CommandContext) {
        let userId: string;

        if (args[0]) {
            userId = args[0].replace(/^<@!?/, "").replace(/>$/, "");
        } else {
            userId = message.author.id;
        }

        if (!userId) {
            await message.reply("❌ ID ou mention invalide.");
            return;
        }

        // Try cache first, then API
        let user = client.users.cache.get(userId);
        if (!user) {
            try {
                user = await client.users.fetch(userId);
            } catch {
                await message.reply("❌ Utilisateur introuvable.");
                return;
            }
        }

        const statusLabels: Record<string, string> = {
            online:    "🟢 En ligne",
            idle:      "🌙 Inactif",
            dnd:       "🔴 Ne pas déranger",
            invisible: "⚫ Invisible",
            offline:   "⚫ Hors ligne",
        };

        const embed = new EmbedBuilder()
            .setTitle(`👤 ${user.username}#${user.tag}`)
            .setColor("#1ABC9C")
            .addFields(
                { name: "🆔 ID",          value: `\`${user.id}\``,                         inline: true  },
                { name: "🤖 Bot",         value: user.bot ? "Oui" : "Non",                 inline: true  },
                { name: "📶 Statut",      value: statusLabels[user.status] ?? user.status, inline: true  }
            )
            .setTimestamp();

        if (user.avatar) embed.setThumbnail(user.avatar);

        await message.reply({ embeds: [embed] });
    },
};

export default command;
