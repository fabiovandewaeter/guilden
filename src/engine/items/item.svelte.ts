// engine/items/item.svelte.ts
import type { Quality } from "./quality.svelte";

export type ItemId = number
export type ItemKind = "iron" | "sword"
export type ItemStack = {
    item_id: ItemId,
    amount: number
};

export class Item {
    readonly id: ItemId;
    kind: ItemKind = $state()!;
    name: string = $state()!;
    quality: Quality = $state()!;
    level: number = $state()!;

    constructor(id: ItemId, name: string, kind: ItemKind, quality: Quality = "Common", level: number = 1) {
        this.id = id;
        this.name = name;
        this.kind = kind;
        this.quality = quality;
        this.level = level;
    }
}
