// engine/entities/types.svelte.ts
import type { ZoneId } from "../zones/zone.svelte";
import { type Opt } from "../utils/option"

export type EntityId = number

export class Entity {
    readonly id: EntityId;
    name: string = $state()!;
    zone_id: Opt<ZoneId> = $state()!;
    max_stats: Stats;

    constructor(id: EntityId, name: string, zone_id: Opt<ZoneId>, max_stats: Stats) {
        this.id = id;
        this.name = name;
        this.zone_id = zone_id;
        this.max_stats = max_stats;
    }
}

export type Stats = {
    hp: number,
    mana: number,
    attack: number
}
