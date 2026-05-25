import type { BloumeChat, Message } from "bloumechat";
import type { BotEvent } from "../types";
import { EmbedBuilder } from "bloumechat";
import { logger } from "../util/logger";

// ── Configuration ──────────────────────────────────────────────────────────────
/** Words that will get the message deleted */
const BLACKLIST: string[] = [
    // Add words to moderate here, e.g.: "spam", "scam"
];

/** Regex for external links (bloumechat.com is whitelisted) */
const LINK_RE = /https?:\/\/(?!(?:www\.)?bloumechat\.com)[^\s]+/gi;

/** Minimum message length before caps check fires */
const CAPS_MIN_LEN = 20;
/** Ratio of uppercase letters above which a message is considered caps abuse */
const CAPS_THRESHOLD = 0.7;

// ── Helper ─────────────────────────────────────────────────────────────────────
function detectViolation(content: string): string | null {
    const lc = content.toLowerCase();

    if (BLACKLIST.length && BLACKLIST.some(w => lc.includes(w))) {
        return "Mot interdit détecté";
    }

    LINK_RE.lastIndex = 0;
    if (LINK_RE.test(content)) {
        return "Lien externe non autorisé";
    }

    if (content.length >= CAPS_MIN_LEN) {
        const letters = (content.match(/[A-Za-z]/g) ?? []).length;
        const upper   = (content.match(/[A-Z]/g) ?? []).length;
        if (letters > 0 && upper / letters > CAPS_THRESHOLD) {
            return "Abus de majuscules";
        }
    }

    return null;
}

// ── Event ──────────────────────────────────────────────────────────────────────
const event: BotEvent<[Message]> = {
    name: "messageCreate",
    async execute(_client: BloumeChat, message: Message) {
        // Skip bots and DMs
        if (message.author.bot || !message.serverId) return;

        const violation = detectViolation(message.content);
        if (!violation) return;

        logger.warn(`Automod [${violation}] — ${message.author.username} in ${message.serverId}`);

        try {
            await message.delete();
        } catch {
            // Missing permissions — skip deletion, still warn
        }

        try {
            const embed = new EmbedBuilder()
                .setTitle("🛡️ Auto-Modération")
                .setDescription(`Le message de <@${message.author.id}> a été supprimé.`)
                .setColor("#FF0000")
                .addFields(
                    { name: "👤 Utilisateur", value: message.author.username, inline: true },
                    { name: "🚫 Raison",       value: violation,              inline: true }
                )
                .setFooter({ text: "Ce message s'auto-détruira dans 10 secondes." })
                .setTimestamp();

            const warning = await message.channel.send({ embeds: [embed] });

            // Auto-delete warning after 10 s
            setTimeout(async () => {
                await warning.delete().catch(() => {});
            }, 10_000);
        } catch (err) {
            logger.error("Automod: failed to send warning embed:", err);
        }
    },
};

export default event;
