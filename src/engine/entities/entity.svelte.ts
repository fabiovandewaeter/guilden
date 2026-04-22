// engine/entities/types.svelte.ts
import type { PlaceRef } from "../places/place_ref.svelte";
import { type Opt } from "../utils/option"

export type EntityId = number & { readonly __type: unique symbol };

export class Entity {
    readonly id: EntityId;
    name: string = $state()!;
    // place_id: Opt<PlaceId> = $state()!;
    place: Opt<PlaceRef> = $state()!;
    max_stats: Stats;
    place_id: any;

    constructor(id: EntityId, name: string, place: Opt<PlaceRef>, max_stats: Stats) {
        this.id = id;
        this.name = name;
        this.place = place;
        this.max_stats = max_stats;
    }
}

export type Stats = {
    hp: number,
    mana: number,
    attack: number
}
