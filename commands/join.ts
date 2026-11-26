import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "join",
    description: "Rejoint un salon vocal — celui où vous êtes déjà par défaut, ou celui donné par nom.",
    usage: "[nom du salon]",
    examples: ["!join", "!join Musique"],
    cooldown: 5,
    guildOnly: true,
    async execute({ client, message, args }: CommandContext) {
        const guild = message.guild;
        if (!guild) return;

        await guild.fetchChannels().catch(() => {});
        const wanted = args.join(" ").toLowerCase();

        // No channel name given: prefer the one the invoking user is
        // currently in (client.voiceStates, @bloume/chat SDK >= 4.1.0) over
        // "just pick the first voice channel" — matches how music bots are
        // expected to behave. Falls back to "first voice channel" if we
        // don't have a voice state for them (e.g. they joined voice before
        // this bot process started and no voice:* event has been seen yet).
        const authorChannelId = wanted ? undefined : client.voiceStates.cache.get(message.author.id)?.channelId;
        const voiceChannel = authorChannelId
            ? guild.channels.find(c => c.id === authorChannelId)
            : guild.channels.find(c => c.type === "VOICE" && (!wanted || c.name.toLowerCase() === wanted));

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
