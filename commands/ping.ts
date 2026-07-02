import type { Command, CommandContext } from "../types";

const command: Command = {
    name: "ping",
    description: "Affiche la latence du bot et son uptime.",
    aliases: ["pong", "latency"],
    cooldown: 5,
    async execute({ client, message }: CommandContext) {
        const start = Date.now();
        // Send a temporary message to measure round-trip
        const tmp = await message.reply("🏓 Calcul de la latence…");
        const latency = Date.now() - start;

        const rawUptime = client.uptime;
        const uptimeStr = rawUptime !== null ? ` · Uptime : \`${formatUptime(rawUptime)}\`` : "";

        await tmp.edit(`🏓 **Pong !** Latence : \`${latency}ms\`${uptimeStr}`);
    },
};

function formatUptime(ms: number): string {
    const s = Math.floor(ms / 1_000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}j ${h % 24}h`;
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

export default command;
