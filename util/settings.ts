import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

/**
 * Per-guild JSON settings, persisted to `data/settings/<guildId>.json`.
 *
 * @example
 * const settings = new SettingsManager()
 * settings.set(guildId, "welcomeChannelId", "abc123")
 * const channelId = settings.get<string>(guildId, "welcomeChannelId", null)
 */
export class SettingsManager {
    private readonly dir: string;
    private readonly cache = new Map<string, Record<string, unknown>>();

    constructor(dir = join(__dirname, "../data/settings")) {
        this.dir = dir;
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    }

    /**
     * Retrieves a value from the guild's settings.
     * Returns `defaultValue` if the key is missing.
     */
    get<T>(guildId: string, key: string, defaultValue: T): T {
        if (!this.cache.has(guildId)) this.load(guildId);
        const data = this.cache.get(guildId)!;
        return (key in data ? data[key] : defaultValue) as T;
    }

    /**
     * Stores a value in the guild's settings and persists to disk.
     */
    set(guildId: string, key: string, value: unknown): void {
        if (!this.cache.has(guildId)) this.load(guildId);
        const data = this.cache.get(guildId)!;
        data[key] = value;
        this.save(guildId, data);
    }

    /**
     * Deletes a key from the guild's settings.
     */
    delete(guildId: string, key: string): void {
        if (!this.cache.has(guildId)) this.load(guildId);
        const data = this.cache.get(guildId)!;
        delete data[key];
        this.save(guildId, data);
    }

    /**
     * Returns all settings for a guild as a plain object.
     */
    all(guildId: string): Record<string, unknown> {
        if (!this.cache.has(guildId)) this.load(guildId);
        return { ...this.cache.get(guildId)! };
    }

    // ── private ──────────────────────────────────────────────────────────────

    private filePath(guildId: string): string {
        return join(this.dir, `${guildId}.json`);
    }

    private load(guildId: string): void {
        const path = this.filePath(guildId);
        try {
            const raw = existsSync(path) ? readFileSync(path, "utf-8") : "{}";
            this.cache.set(guildId, JSON.parse(raw));
        } catch {
            this.cache.set(guildId, {});
        }
    }

    private save(guildId: string, data: Record<string, unknown>): void {
        try {
            writeFileSync(this.filePath(guildId), JSON.stringify(data, null, 2), "utf-8");
        } catch (err) {
            console.error(`[SettingsManager] Failed to save ${guildId}:`, err);
        }
    }
}
