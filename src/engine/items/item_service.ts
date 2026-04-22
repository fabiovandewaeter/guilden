// engine/items/item_service.ts

import type { CraftingRequirement } from "./crafting_service";
import type { ItemArchetype } from "./item_archetype";

export function archetype_matches_requirement(archetype: ItemArchetype, requirement: CraftingRequirement): boolean {

    if (requirement.kind !== undefined && archetype.kind !== requirement.kind) {
        return false;
    }

    if (requirement.minLevel !== undefined && archetype.level < requirement.minLevel) {
        return false;
    }
    if (requirement.maxLevel !== undefined && archetype.level > requirement.maxLevel) {
        return false;
    }

    if (requirement.qualities && !requirement.qualities.includes(archetype.quality)) {
        return false;
    }

    return true;
}
