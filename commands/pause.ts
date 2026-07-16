import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "pause",
    description: "Met la lecture en pause, ou la reprend si déjà en pause.",
    aliases: ["resume"],
    cooldown: 2,
    guildOnly: true,
    async execute({ client, message }: CommandContext) {
        const connection = client.voice.connection;
        if (!connection) {
            await message.reply("❌ Le bot n'est connecté à aucun salon vocal.");
            return;
        }

        if (connection.isPaused) {
            connection.resume();
            await message.reply("▶️ Reprise.");
        } else {
            connection.pause();
            await message.reply("⏸️ En pause.");
        }
    },
};

export default command;
