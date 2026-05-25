interface CooldownEntry {
    expiresAt: number;
    timer: ReturnType<typeof setTimeout>;
}

/**
 * Tracks per-command per-user cooldowns with automatic cleanup.
 *
 * @example
 * const cooldowns = new CooldownManager()
 *
 * // Check before executing
 * const remaining = cooldowns.check("ban", userId)
 * if (remaining > 0) { message.reply(`Wait ${remaining.toFixed(1)}s`) ; return }
 *
 * // Set after executing
 * cooldowns.set("ban", userId, 5)
 */
export class CooldownManager {
    /** command name → userId → entry */
    private readonly store = new Map<string, Map<string, CooldownEntry>>();

    /**
     * Returns the remaining cooldown in seconds (> 0) or 0 if the user is clear.
     */
    check(commandName: string, userId: string): number {
        const entry = this.store.get(commandName)?.get(userId);
        if (!entry) return 0;
        const remaining = (entry.expiresAt - Date.now()) / 1000;
        return remaining > 0 ? remaining : 0;
    }

    /**
     * Applies a cooldown for `seconds` seconds.
     * Automatically clears the entry when it expires.
     */
    set(commandName: string, userId: string, seconds: number): void {
        if (!this.store.has(commandName)) {
            this.store.set(commandName, new Map());
        }

        // Cancel existing timer if any
        const existing = this.store.get(commandName)!.get(userId);
        if (existing) clearTimeout(existing.timer);

        const timer = setTimeout(() => {
            this.store.get(commandName)?.delete(userId);
        }, seconds * 1_000);

        this.store.get(commandName)!.set(userId, {
            expiresAt: Date.now() + seconds * 1_000,
            timer,
        });
    }

    /**
     * Manually clears a user's cooldown for a command.
     */
    clear(commandName: string, userId: string): void {
        const map = this.store.get(commandName);
        if (!map) return;
        const entry = map.get(userId);
        if (entry) {
            clearTimeout(entry.timer);
            map.delete(userId);
        }
    }

    /**
     * Clears all cooldowns for an entire command.
     */
    clearAll(commandName: string): void {
        const map = this.store.get(commandName);
        if (!map) return;
        for (const entry of map.values()) clearTimeout(entry.timer);
        this.store.delete(commandName);
    }
}
