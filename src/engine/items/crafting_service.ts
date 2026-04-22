// engine/items/crafting_service.ts

import type { Inventory } from "./inventory.svelte";
import { err, ok, type Result } from "../utils/result";
import type { ItemKind } from "./item_kind";
import type { ItemArchetype } from "./item_archetype";
import { archetype_matches_requirement } from "./item_service";
import type { Quality } from "./quality.svelte";

/** AND requirements except for qualities where it's OR */
export type CraftingRequirement = {
    amount: number,
    kind?: ItemKind,
    minLevel?: number,
    maxLevel?: number,
    /** the item must have a quality in the list */
    qualities?: Quality[],
};

/** consume the stackable items only if requirment is satisfied */
export function consume_stackable_items_from_inventory(
    inventory: Inventory,
    requirement: CraftingRequirement
): Result<void, string> {
    let remaining_to_find = requirement.amount;
    const items_to_consume: { archetype: ItemArchetype, amount: number }[] = [];

    for (const stack of Object.values(inventory.stackable_items)) {
        if (archetype_matches_requirement(stack.archetype, requirement)) {
            const take_amount = Math.min(stack.amount, remaining_to_find);
            items_to_consume.push({ archetype: stack.archetype, amount: take_amount });
            remaining_to_find -= take_amount;

            if (remaining_to_find === 0) break;
        }
    }

    if (remaining_to_find > 0) {
        return err(`Couldn't consume crafting materials: not enough items found`);
    }

    for (const to_consume of items_to_consume) {
        inventory.remove_stackable(to_consume.archetype, to_consume.amount).assert_ok();
    }

    return ok(undefined);
}
