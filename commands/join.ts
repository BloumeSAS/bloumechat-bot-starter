import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "join",
    description: "Rejoint un salon vocal du serveur (le premier trouvé, ou celui donné par nom).",
    usage: "[nom du salon]",
    examples: ["!join", "!join Musique"],
    cooldown: 5,
    guildOnly: true,
    async execute({ client, message, args }: CommandContext) {
        const guild = message.guild;
        if (!guild) return;

        await guild.fetchChannels().catch(() => {});
        const wanted = args.join(" ").toLowerCase();
        const voiceChannel = guild.channels.find(c => c.type === "VOICE" && (!wanted || c.name.toLowerCase() === wanted));

        if (!voiceChannel) {
            await message.reply(wanted ? `❌ Aucun salon vocal nommé « ${args.join(" ")} » trouvé.` : "❌ Ce serveur n'a aucun salon vocal.");
            return;
        }

        try {
            await voiceChannel.join();
            await message.reply(`🔊 Connecté à **${voiceChannel.name}**.`);
        } catch (err) {
            await message.reply(`❌ Impossible de rejoindre : ${(err as Error).message}`);
        }
    },
};

export default command;
