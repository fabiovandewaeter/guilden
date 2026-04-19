// engine/items/item_repository.svelte.ts
import { GenericRepository } from "../generic_repository.svelte";
import { type ItemId, type ItemKind, Item } from "./item.svelte";
import type { Quality } from "./quality.svelte";

export class ItemRepository extends GenericRepository<ItemId, Item> {
    spawn(name: string, kind: ItemKind, quality: Quality, level: number): ItemId {
        const id: ItemId = this.next_id++;
        const entity: Item = new Item(id, name, kind, quality, level);

        this.elements[id] = entity;
        return id;
    }
}
