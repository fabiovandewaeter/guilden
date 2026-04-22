// engine/items/instanced_item_repository.svelte.ts
import { GenericRepository } from "../generic_repository.svelte";
import { type InstancedItemId, InstancedItem } from "./instanced_item.svelte";
import type { ItemArchetype } from "./item_archetype";
import type { ItemKind } from "./item_kind";
import type { Quality } from "../quality.svelte";

export class InstancedItemRepository extends GenericRepository<InstancedItemId, InstancedItem> {
    spawn(name: string, kind: ItemKind, quality: Quality, level: number): InstancedItemId {
        const id: InstancedItemId = this.next_id() as InstancedItemId;
        const entity: InstancedItem = new InstancedItem(id, name, { kind, quality, level } as ItemArchetype);

        this.elements[id] = entity;
        return id;
    }
}
