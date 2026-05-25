// ANSI colour codes
const R  = "\x1b[0m";   // reset
const RED  = "\x1b[31m";
const GRN  = "\x1b[32m";
const YLW  = "\x1b[33m";
const BLU  = "\x1b[34m";
const MAG  = "\x1b[35m";
const CYN  = "\x1b[36m";
const GRY  = "\x1b[90m";

function ts(): string {
    return new Date().toLocaleTimeString("fr-FR", { hour12: false });
}

function badge(color: string, label: string): string {
    return `${GRY}[${ts()}]${R} ${color}[${label}]${R}`;
}

export const logger = {
    /** General informational message */
    info(msg: string): void {
        console.log(`${badge(BLU, "INFO")} ${msg}`);
    },

    /** Positive confirmation / milestone */
    success(msg: string): void {
        console.log(`${badge(GRN, "OK")} ${msg}`);
    },

    /** Non-fatal warning */
    warn(msg: string): void {
        console.warn(`${badge(YLW, "WARN")} ${msg}`);
    },

    /** Error — optionally attach the error object */
    error(msg: string, err?: unknown): void {
        console.error(`${badge(RED, "ERROR")} ${msg}`);
        if (err) console.error(err);
    },

    /** Verbose debug info (visible at all times — gate yourself with env if needed) */
    debug(msg: string): void {
        console.debug(`${badge(GRY, "DEBUG")} ${msg}`);
    },

    /** Logs a command invocation */
    command(name: string, user: string, guild: string): void {
        console.log(`${badge(MAG, "CMD")} ${CYN}${name}${R} • ${user} • ${GRY}${guild}${R}`);
    },
};
