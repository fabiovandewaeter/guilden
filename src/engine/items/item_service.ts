// engine/items/item_service.ts

import type { CraftingRequirement } from "./crafting_service";
import type { ItemId } from "./item.svelte";
import type { ItemRepository } from "./item_repository.svelte";

export function matches_requirement(item_id: ItemId, requirement: CraftingRequirement, item_repository: ItemRepository): boolean {
    const item = item_repository.get_or_err(item_id).expect();

    if (requirement.minLevel !== undefined && item.level < requirement.minLevel) {
        return false;
    }
    if (requirement.maxLevel !== undefined && item.level > requirement.maxLevel) {
        return false;
    }

    if (requirement.qualities && !requirement.qualities.includes(item.quality)) {
        return false;
    }

    return true;
}
