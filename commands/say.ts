import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "say",
    description: "Fait répéter un message au bot dans le canal actuel.",
    aliases: ["echo", "repeat"],
    usage: "<message>",
    examples: ["say Bonjour tout le monde !", "say @everyone Réunion dans 5 minutes !"],
    cooldown: 5,
    guildOnly: false,
    async execute({ client, message, args }: CommandContext) {
        if (args.length === 0) {
            await message.reply("❌ Veuillez entrer un message. Exemple : `!say Bonjour !`");
            return;
        }

        const text = args.join(" ").substring(0, 2_000);

        // Delete the original command to keep things clean
        await message.delete().catch(() => {});

        await client.sendMessage(message.channelId, text);
    },
};

export default command;
