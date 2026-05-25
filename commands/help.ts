import type { Command, CommandContext } from "../types";
import { commands, config } from "../index";
import { EmbedBuilder } from "bloumechat";

const command: Command = {
    name: "help",
    description: "Affiche la liste des commandes ou l'aide détaillée d'une commande.",
    aliases: ["h", "aide", "commands"],
    usage: "[commande]",
    examples: ["help", "help ban", "help serverinfo"],
    cooldown: 5,
    async execute({ message, args }: CommandContext) {
        const prefix = config.prefix;

        // ── Specific command help ──────────────────────────────────────────────
        if (args.length > 0) {
            const name = args[0].toLowerCase();
            const cmd = commands.get(name);
            if (!cmd) {
                await message.reply(`❌ Commande \`${prefix}${name}\` introuvable.`);
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(`📖 ${prefix}${cmd.name}`)
                .setDescription(cmd.description)
                .setColor("#5865F2");

            embed.addFields({
                name: "📌 Utilisation",
                value: `\`${prefix}${cmd.name}${cmd.usage ? ` ${cmd.usage}` : ""}\``,
            });

            if (cmd.aliases?.length) {
                embed.addFields({
                    name: "🔀 Alias",
                    value: cmd.aliases.map(a => `\`${prefix}${a}\``).join("  "),
                });
            }

            if (cmd.examples?.length) {
                embed.addFields({
                    name: "💡 Exemples",
                    value: cmd.examples.map(e => `\`${prefix}${e}\``).join("\n"),
                });
            }

            if (cmd.cooldown) {
                embed.addFields({ name: "⏳ Cooldown", value: `${cmd.cooldown}s`, inline: true });
            }

            if (cmd.guildOnly) {
                embed.addFields({ name: "🏠 Serveur uniquement", value: "Oui", inline: true });
            }

            await message.reply({ embeds: [embed] });
            return;
        }

        // ── Full command list ──────────────────────────────────────────────────
        const sorted = [...commands.values()].sort((a, b) => a.name.localeCompare(b.name));

        const embed = new EmbedBuilder()
            .setTitle("📋 Commandes disponibles")
            .setDescription(
                `Utilisez \`${prefix}help <commande>\` pour obtenir l'aide détaillée.\n` +
                `Préfixe actuel : \`${prefix}\``
            )
            .setColor("#5865F2");

        for (const cmd of sorted) {
            embed.addFields({
                name: `${prefix}${cmd.name}`,
                value: cmd.description,
                inline: true,
            });
        }

        await message.reply({ embeds: [embed] });
    },
};

export default command;
