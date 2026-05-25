import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "clear",
    description: "Supprime un nombre de messages dans le canal actuel (max 100).",
    aliases: ["purge", "prune", "delete"],
    usage: "<1–100>",
    examples: ["clear 10", "purge 50"],
    cooldown: 10,
    guildOnly: true,
    async execute({ message, args }: CommandContext) {
        const amount = parseInt(args[0] ?? "", 10);

        if (isNaN(amount) || amount < 1 || amount > 100) {
            await message.reply("❌ Veuillez spécifier un nombre entre **1** et **100**.");
            return;
        }

        try {
            // Fetch messages then bulk-delete by their IDs
            const fetched = await message.channel.fetchMessages(amount + 1); // +1 to include the command msg
            const ids = fetched
                .slice(0, amount + 1)
                .map((m: any) => m.publicId ?? m.id)
                .filter(Boolean) as string[];

            if (ids.length === 0) {
                await message.reply("❌ Aucun message à supprimer.");
                return;
            }

            await message.channel.bulkDelete(ids);

            const confirm = await message.channel.send(
                `✅ **${ids.length}** message(s) supprimé(s).`
            );

            // Auto-remove the confirmation after 5 s
            setTimeout(async () => {
                await confirm.delete().catch(() => {});
            }, 5_000);
        } catch {
            await message.reply("❌ Impossible de supprimer les messages (permissions manquantes ?).");
        }
    },
};

export default command;
