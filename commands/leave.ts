import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "leave",
    description: "Quitte le salon vocal actuel.",
    aliases: ["disconnect", "dc"],
    cooldown: 2,
    guildOnly: true,
    async execute({ client, message }: CommandContext) {
        if (!client.voice.connection) {
            await message.reply("❌ Le bot n'est connecté à aucun salon vocal.");
            return;
        }

        client.voice.leave();
        await message.reply("👋 Salon vocal quitté.");
    },
};

export default command;
