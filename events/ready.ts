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

        // Once the SDK >= 2.0 is published, you can use:
        // await client.setActivity({ type: "using", name: "BloumeChat" })
    },
};

export default event;
