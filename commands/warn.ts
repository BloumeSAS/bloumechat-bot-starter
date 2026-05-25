import type { Command, CommandContext } from "../types";
import { EmbedBuilder } from "bloumechat";

/** In-memory store: `guildId:userId` → list of warnings */
const warnStore = new Map<string, Array<{ reason: string; moderator: string; at: number }>>();

const command: Command = {
    name: "warn",
    description: "Avertit un membre du serveur. Les avertissements sont cumulatifs.",
    aliases: ["avertir", "warning"],
    usage: "<@utilisateur|id> [raison]",
    examples: ["warn @User Langage inapproprié", "warn @User Spam"],
    cooldown: 5,
    guildOnly: true,
    async execute({ message, args }: CommandContext) {
        if (!message.serverId) return;

        if (!args[0]) {
            await message.reply(`❌ Usage : \`!warn @utilisateur [raison]\``);
            return;
        }

        const userId = args[0].replace(/^<@!?/, "").replace(/>$/, "");
        if (!userId) {
            await message.reply("❌ Mention ou ID invalide.");
            return;
        }

        const reason = args.slice(1).join(" ") || "Aucune raison fournie";
        const key    = `${message.serverId}:${userId}`;

        if (!warnStore.has(key)) warnStore.set(key, []);
        warnStore.get(key)!.push({ reason, moderator: message.author.id, at: Date.now() });

        const count = warnStore.get(key)!.length;

        const embed = new EmbedBuilder()
            .setTitle("⚠️ Avertissement")
            .setColor("#FFA500")
            .addFields(
                { name: "👤 Utilisateur",      value: `<@${userId}>`,               inline: true },
                { name: "🛡️ Modérateur",       value: `<@${message.author.id}>`,    inline: true },
                { name: "🔢 Avertissement n°", value: `${count}`,                   inline: true },
                { name: "📝 Raison",            value: reason,                       inline: false }
            )
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    },
};

export default command;
