import type { BloumeChat, Member } from "bloumechat";
import type { BotEvent } from "../types";
import { logger } from "../util/logger";

const event: BotEvent = {
    name: "guildMemberAdd",
    async execute(client: BloumeChat, member: Member) {
        const guild = client.guilds.cache.get(member.serverId);
        logger.info(`${member.user.username} joined ${guild?.name ?? member.serverId}`);
    },
};

export default event;
