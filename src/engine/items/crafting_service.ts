// engine/items/crafting_service.ts

import type { Inventory } from "../inventory.svelte";
import { err, ok, type Result } from "../utils/result";
import type { ItemKind } from "./item.svelte";
import type { ItemRepository } from "./item_repository.svelte";
import { matches_requirement } from "./item_service";
import type { Quality } from "./quality.svelte";

export type CraftingRequirement = {
    amount: number,
    kind?: ItemKind,
    minLevel?: number,
    maxLevel?: number,
    qualities?: Quality[],
};

export function consume_crating_materials(
    inventory: Inventory,
    item_repo: ItemRepository,
    requirement: CraftingRequirement
): Result<void, string> {
    let remaining_to_find = requirement.amount;
    const items_to_consume: { id: number, amount: number }[] = [];

    for (const stack of inventory.items) {
        if (matches_requirement(stack.item_id, requirement, item_repo)) {
            const take_amount = Math.min(stack.amount, remaining_to_find);
            items_to_consume.push({ id: stack.item_id, amount: take_amount });
            remaining_to_find -= take_amount;

            if (remaining_to_find === 0) break;
        }
    }

    if (remaining_to_find > 0) {
        return err(`Couldn't consume crafting materials: not enough items found`);
    }

    for (const to_consume of items_to_consume) {
        inventory.remove(to_consume.id, to_consume.amount).assert_ok();
    }

    return ok(undefined);
}
