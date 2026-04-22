// engine/items/item.svelte.ts
import type { ItemArchetype } from "./item_archetype";
import type { ItemKind } from "./item_kind";
import type { Quality } from "../quality.svelte";

export type InstancedItemId = number & { readonly __type: unique symbol };
// export type ItemStack = { item_id: ItemId, amount: number };

/** Non-stackable items */
export class InstancedItem {
    readonly id: InstancedItemId;
    name: string = $state()!;
    archetype: ItemArchetype = $state()!;

    constructor(id: InstancedItemId, name: string, archetype: ItemArchetype) {
        this.id = id;
        this.name = name;
        this.archetype = archetype;
    }

    get kind(): ItemKind { return this.archetype.kind; }
    get quality(): Quality { return this.archetype.quality; }
    get level(): number { return this.archetype.level; }

    set kind(kind: ItemKind) { this.archetype.kind = kind; }
    set quality(quality: Quality) { this.archetype.quality = quality; }
    set level(level: number) { this.archetype.level = level; }
}
