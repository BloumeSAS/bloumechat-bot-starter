import type { BloumeChat } from "bloumechat";
import type { BotEvent } from "../types";
import { logger } from "../util/logger";

const event: BotEvent = {
    name: "guildMemberRemove",
    async execute(client: BloumeChat, data: any) {
        const guildId: string = data.serverPublicId ?? data.serverId;
        const guild = client.guilds.cache.get(guildId);

        const user = data.user ?? data;
        const username: string = user.name ?? user.username ?? "Inconnu";

        logger.info(`${username} left ${guild?.name ?? guildId}`);
    },
};

export default event;
