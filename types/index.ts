import type { BloumeChat, Message } from "bloumechat";

/**
 * Context passed to every command's execute function.
 */
export interface CommandContext {
    /** The BloumeChat client instance */
    client: BloumeChat;
    /** The message that triggered the command */
    message: Message;
    /** Arguments split by whitespace — prefix and command name already removed */
    args: string[];
    /** The prefix that was used (e.g. "!") */
    prefix: string;
}

/**
 * A bot command definition.
 */
export interface Command {
    /** Primary name used to invoke the command (must be unique) */
    name: string;
    /** Short description shown in `!help` */
    description: string;
    /** Alternative names that also invoke this command */
    aliases?: string[];
    /** Usage hint shown in `!help <cmd>`, e.g. "<@user> [reason]" */
    usage?: string;
    /** Example invocations shown in `!help <cmd>` */
    examples?: string[];
    /** Per-user cooldown in seconds (0 = no cooldown) */
    cooldown?: number;
    /** If true, refuses to execute outside a server (no DMs) */
    guildOnly?: boolean;
    /** Main handler */
    execute(ctx: CommandContext): Promise<void> | void;
}

/**
 * A bot event listener definition.
 */
export interface BotEvent<Args extends unknown[] = unknown[]> {
    /** The event name to listen on (e.g. "messageCreate", "guildMemberAdd") */
    name: string;
    /** If true, the listener fires only once then unregisters */
    once?: boolean;
    /** Handler called with the client + the event arguments */
    execute(client: BloumeChat, ...args: Args): Promise<void> | void;
}

/**
 * Static bot configuration resolved once at startup.
 */
export interface BotConfig {
    /** Command prefix (e.g. "!") */
    prefix: string;
    /** Bot token — never log or expose this */
    token: string;
    /** Owner user ID — used for owner-only guards */
    ownerId?: string;
    /** Default cooldown in seconds for commands that don't set their own */
    defaultCooldown: number;
}
