import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "stop",
    description: "Arrête la lecture audio en cours (reste connecté au salon vocal).",
    cooldown: 2,
    guildOnly: true,
    async execute({ client, message }: CommandContext) {
        const connection = client.voice.connection;
        if (!connection) {
            await message.reply("❌ Le bot n'est connecté à aucun salon vocal.");
            return;
        }

        connection.stopPlaying();
        await message.reply("⏹️ Lecture arrêtée.");
    },
};

export default command;
