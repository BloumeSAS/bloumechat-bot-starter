import type { Command, CommandContext } from "../types";
import { EmbedBuilder } from "bloumechat";

const command: Command = {
    name: "embed",
    description: "Envoie un message embed personnalisé.",
    aliases: ["e"],
    usage: "<titre> | <description> [| #couleur]",
    examples: [
        "embed Annonce | Nouvelle fonctionnalité disponible !",
        "embed 🎉 Événement | Rejoignez-nous ce soir à 20h | #FF5733",
    ],
    cooldown: 10,
    guildOnly: true,
    async execute({ client, message, args }: CommandContext) {
        const raw   = args.join(" ");
        const parts = raw.split("|").map(s => s.trim());

        if (parts.length < 2 || !parts[0] || !parts[1]) {
            await message.reply(
                "❌ Usage : `!embed Titre | Description [| #couleur]`\n" +
                "Exemple : `!embed Annonce | Nouvelle fonctionnalité | #5865F2`"
            );
            return;
        }

        const [title, description, colorArg] = parts;
        const color = /^#[0-9A-Fa-f]{6}$/.test(colorArg ?? "") ? colorArg : "#5865F2";

        const embed = new EmbedBuilder()
            .setTitle(title.substring(0, 256))
            .setDescription(description.substring(0, 4_096))
            .setColor(color)
            .setFooter({ text: `Envoyé par ${message.author.username}` })
            .setTimestamp();

        await message.reply({ embeds: [embed] });

        // Delete the original command message to keep the chat clean
        await message.delete().catch(() => {});
    },
};

export default command;
