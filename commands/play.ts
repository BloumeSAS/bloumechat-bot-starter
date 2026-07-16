import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "play",
    description: "Joue une piste audio (URL ou chemin local) dans le salon vocal — rejoint automatiquement si besoin.",
    usage: "<url>",
    examples: ["!play https://example.com/musique.mp3"],
    cooldown: 3,
    guildOnly: true,
    async execute({ client, message, args }: CommandContext) {
        const resource = args[0];
        if (!resource) {
            await message.reply("Usage : `!play <url>`");
            return;
        }

        let connection = client.voice.connection;
        if (!connection) {
            const guild = message.guild;
            const voiceChannel = guild?.channels.find(c => c.type === "VOICE");
            if (!voiceChannel) {
                await message.reply("❌ Aucun salon vocal trouvé — utilisez `!join` d'abord si besoin.");
                return;
            }
            try {
                connection = await voiceChannel.join();
            } catch (err) {
                await message.reply(`❌ Impossible de rejoindre le salon vocal : ${(err as Error).message}`);
                return;
            }
        }

        connection.play(resource);
        await message.reply(`🔊 Lecture : ${resource}`);
    },
};

export default command;
