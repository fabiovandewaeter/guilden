// src/engine/items/inventory.svelte.ts
import type { InstancedItemId } from "./instanced_item.svelte";
import { hash_item_archetype, type ItemArchetype } from "./item_archetype";
import { err, ok, type Result } from "../utils/result";

export class Inventory {
    /** e.g. iron ore, iron ingot, perfect iron ingot etc. */
    stackable_items: Record<string, { archetype: ItemArchetype, amount: number }> = $state({});
    /** unique, non-stackable items */
    instanced_items: InstancedItemId[] = $state([]);

    // ==========================================
    // STACKABLE ITEMS
    // ==========================================
    add_stackable(archetype: ItemArchetype, amount: number) {
        const hash = hash_item_archetype(archetype);
        if (this.stackable_items[hash]) {
            this.stackable_items[hash].amount += amount;
        } else {
            this.stackable_items[hash] = { archetype, amount };
        }
    }

    remove_stackable(archetype: ItemArchetype, amount: number): Result<void, string> {
        if (amount <= 0) return err("Amount to remove must be greater than zero");

        if (!this.has_enough_stackabel(archetype, amount)) {
            return err(`Couldn't remove stckable item ${archetype} from inventory: not enough items`);
        }

        const hash = hash_item_archetype(archetype);
        this.stackable_items[hash].amount -= amount;

        if (this.stackable_items[hash].amount <= 0) {
            delete this.stackable_items[hash];
        }

        return ok(undefined);
    }

    has_enough_stackabel(archetype: ItemArchetype, amount: number): boolean {
        return this.quantity_stackable(archetype) >= amount;
    }

    quantity_stackable(archetype: ItemArchetype): number {
        const hash = hash_item_archetype(archetype);
        return this.stackable_items[hash] ? this.stackable_items[hash].amount : 0;
    }

    // ==========================================
    // INSTANCED (UNIQUE) ITEMS
    // ==========================================
    add_instanced(item_id: InstancedItemId) {
        if (!this.instanced_items.includes(item_id)) {
            this.instanced_items.push(item_id);
        }
    }

    remove_instanced(item_id: InstancedItemId): Result<void, string> {
        const index = this.instanced_items.indexOf(item_id);
        if (index !== -1) {
            this.instanced_items.splice(index, 1);
            return ok(undefined);
        }
        return err(`Couldn't remove instanced item ${item_id}`);
    }

    has_instanced(item_id: InstancedItemId): boolean {
        return this.instanced_items.includes(item_id);
    }

    // get_stackable_items_by_quality(target_quality: Quality) {
    //     return Object.values(this.stackable_items).filter(
    //         (stack) => stack.archetype.quality === target_quality
    //     );
    // }
}
