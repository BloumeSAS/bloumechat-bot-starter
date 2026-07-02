import type { BloumeChat } from "bloumechat";
import type { BotEvent } from "../types";
import { logger } from "../util/logger";

const event: BotEvent = {
    name: "ready",
    once: true,
    async execute(client: BloumeChat) {
        logger.success(`Connected as ${client.user?.username}#${client.user?.tag}`);
        logger.info(`Serving ${client.guilds.cache.size} server(s)`);

        await client.setStatus("online").catch(() => { /* non-fatal */ });

        await client.setActivity({ type: "playing", name: "BloumeChat" }).catch(() => { /* non-fatal */ });
    },
};

export default event;
