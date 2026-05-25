import type { BloumeChat, Message } from "bloumechat";
import type { BotEvent } from "../types";
import { commands, aliases, cooldowns, config } from "../index";
import { logger } from "../util/logger";

const event: BotEvent<[Message]> = {
    name: "messageCreate",
    async execute(client: BloumeChat, message: Message) {
        // Ignore bots and messages without prefix
        if (message.author.bot) return;
        if (!message.content.startsWith(config.prefix)) return;

        // Parse command and args
        const args = message.content.slice(config.prefix.length).trim().split(/\s+/);
        const rawName = args.shift()?.toLowerCase() ?? "";
        if (!rawName) return;

        // Resolve alias → canonical name
        const resolvedName = aliases.get(rawName) ?? rawName;
        const command = commands.get(resolvedName);
        if (!command) return;

        // Guild-only guard
        if (command.guildOnly && !message.serverId) {
            await message.reply("❌ Cette commande ne peut être utilisée que dans un serveur.");
            return;
        }

        // Cooldown check
        const remaining = cooldowns.check(command.name, message.author.id);
        if (remaining > 0) {
            await message.reply(
                `⏳ Patientez encore **${remaining.toFixed(1)}s** avant de réutiliser \`${config.prefix}${command.name}\`.`
            );
            return;
        }

        // Register cooldown before executing (prevents spam on slow commands)
        const cd = command.cooldown ?? config.defaultCooldown;
        if (cd > 0) cooldowns.set(command.name, message.author.id, cd);

        // Execute
        try {
            logger.command(
                `${config.prefix}${command.name}`,
                message.author.username,
                message.serverId ?? "DM"
            );
            await command.execute({ client, message, args, prefix: config.prefix });
        } catch (err) {
            logger.error(`Error in command ${command.name}:`, err);
            await message.reply("❌ Une erreur est survenue lors de l'exécution de cette commande.").catch(() => {});
        }
    },
};

export default event;
