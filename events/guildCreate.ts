import type { BloumeChat, Guild } from "bloumechat";
import type { BotEvent } from "../types";
import { logger } from "../util/logger";

const event: BotEvent = {
    name: "guildCreate",
    async execute(_client: BloumeChat, guild: Guild) {
        logger.success(`Joined a new server: ${guild.name} (${guild.memberCount} members)`);
    },
};

export default event;
