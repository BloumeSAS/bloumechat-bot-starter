import type { Command, CommandContext } from "../types";
import { EmbedBuilder } from "bloumechat";

const EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

const command: Command = {
    name: "poll",
    description: "Crée un sondage avec une question et jusqu'à 10 options.",
    aliases: ["sondage", "vote"],
    usage: "<question> | <option1> | <option2> [| option3...]",
    examples: [
        "poll Meilleure couleur ? | Rouge | Bleu | Vert",
        "poll Soirée ce soir ? | Oui 🎉 | Non 😴",
    ],
    cooldown: 30,
    guildOnly: true,
    async execute({ message, args }: CommandContext) {
        const raw   = args.join(" ");
        const parts = raw.split("|").map(s => s.trim()).filter(Boolean);

        if (parts.length < 3) {
            await message.reply(
                "❌ Usage : `!poll Question ? | Option A | Option B [| Option C...]`\n" +
                "Minimum 2 options requises."
            );
            return;
        }

        const [question, ...options] = parts;

        if (options.length > 10) {
            await message.reply("❌ Maximum **10 options** par sondage.");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${question}`)
            .setDescription(
                options.map((opt, i) => `${EMOJIS[i]} **${opt}**`).join("\n\n")
            )
            .setColor("#5865F2")
            .setFooter({ text: `Sondage créé par ${message.author.username}` })
            .setTimestamp();

        const pollMsg = await message.channel.send({ embeds: [embed] });

        // Add reactions as voting buttons
        for (let i = 0; i < options.length; i++) {
            await pollMsg.react(EMOJIS[i]).catch(() => {});
        }

        // Delete the command trigger to keep the channel clean
        await message.delete().catch(() => {});
    },
};

export default command;
