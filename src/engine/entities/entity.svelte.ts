// engine/entities/types.svelte.ts
import type { PlaceRef } from "../places/place_ref.svelte";
import { type Opt } from "../utils/option"
import type { Archetype } from "./archetype";
import type { Profession } from "./profession";
import type { Species } from "./species";

export type EntityId = number & { readonly __type: unique symbol };

export class Entity {
    readonly id: EntityId;
    name: string = $state()!;
    place: Opt<PlaceRef> = $state()!;
    max_stats: Stats;
    species: Species;
    archetype: Archetype;
    profession: Profession;

    constructor(id: EntityId, name: string, place: Opt<PlaceRef>, max_stats: Stats, species: Species, archetype: Archetype, profession: Profession) {
        this.id = id;
        this.name = name;
        this.place = place;
        this.max_stats = max_stats;
        this.species = species;
        this.archetype = archetype;
        this.profession = profession;
    }
}

export type Stats = {
    hp: number,
    mana: number,
    attack: number
}
