// engine/items/item_archetype.ts

import type { ItemKind } from "./item_kind";
import type { Quality } from "./quality.svelte";

export type ItemArchetype = {
    kind: ItemKind,
    quality: Quality,
    level: number,
};

/** Helper to generate the hash for stackables */
export function hash_item_archetype(archetype: ItemArchetype): string {
    return `${archetype.kind}|${archetype.quality}|${archetype.level}`;
}
