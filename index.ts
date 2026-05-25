import "dotenv/config";
import { readdirSync } from "fs";
import { join } from "path";
import { BloumeChat } from "bloumechat";
import type { Command, BotConfig } from "./types";
import { CooldownManager } from "./util/cooldown";
import { logger } from "./util/logger";

// ── Configuration ──────────────────────────────────────────────────────────────
export const config: BotConfig = {
    prefix: process.env.BOT_PREFIX ?? "!",
    token:  process.env.BOT_TOKEN  ?? "",
    ownerId: process.env.OWNER_ID,
    defaultCooldown: 3,
};

if (!config.token) {
    logger.error("BOT_TOKEN is not set. Add it to your .env file and restart.");
    process.exit(1);
}

// ── Client & shared registries ─────────────────────────────────────────────────
export const client   = new BloumeChat();
/** command name → Command */
export const commands = new Map<string, Command>();
/** alias → canonical command name */
export const aliases  = new Map<string, string>();
/** per-command per-user cooldown tracker */
export const cooldowns = new CooldownManager();

// ── Loaders ────────────────────────────────────────────────────────────────────
function loadCommands(): void {
    const dir = join(__dirname, "commands");
    const files = readdirSync(dir).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

    for (const file of files) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod = require(join(dir, file));
            const cmd: Command = mod.default ?? mod.command;
            if (!cmd?.name || typeof cmd.execute !== "function") {
                logger.warn(`Skipping ${file}: missing name or execute`);
                continue;
            }
            commands.set(cmd.name, cmd);
            cmd.aliases?.forEach(alias => aliases.set(alias, cmd.name));
            logger.debug(`Loaded command: ${cmd.name}`);
        } catch (err) {
            logger.error(`Failed to load command ${file}:`, err);
        }
    }
    logger.success(`${commands.size} command(s) ready`);
}

function loadEvents(): void {
    const dir = join(__dirname, "events");
    const files = readdirSync(dir).filter(f => f.endsWith(".ts") || f.endsWith(".js"));
    let count = 0;

    for (const file of files) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const mod  = require(join(dir, file));
            const event = mod.default ?? mod.event ?? mod;
            if (!event?.name || typeof event.execute !== "function") {
                logger.warn(`Skipping event ${file}: invalid shape`);
                continue;
            }
            const handler = (...args: unknown[]) => event.execute(client, ...args);
            event.once ? client.once(event.name, handler) : client.on(event.name, handler);
            count++;
            logger.debug(`Loaded event: ${event.name}`);
        } catch (err) {
            logger.error(`Failed to load event ${file}:`, err);
        }
    }
    logger.success(`${count} event handler(s) registered`);
}

// ── Global error handling ──────────────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise rejection:", reason);
});

process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
});

// Suppress transient connection errors during Socket.IO reconnects
client.on("error", (error: any) => {
    const isTransport = error?.type === "TransportError" || error?.message === "websocket error";
    const isConnRefused = error?.code === "ECONNREFUSED" || error?.description?.code === "ECONNREFUSED";
    if (!isTransport && !isConnRefused) {
        logger.error("SDK error:", error);
    }
});

client.on("reconnect", () => logger.info("Reconnected to BloumeChat"));
client.on("disconnect", (reason: string) => logger.warn(`Disconnected: ${reason}`));

// ── Bootstrap ─────────────────────────────────────────────────────────────────
logger.info("Starting BloumeChat Bot…");
loadCommands();
loadEvents();

client.login(config.token).catch((err) => {
    logger.error("Login failed:", err);
    process.exit(1);
});
