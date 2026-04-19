// engine/recipe.ts
import type { CraftingRequirement } from "./items/crafting_service";
import type { ItemKind } from "./items/item.svelte";

export type RecipeOutput = {
    kind: ItemKind;
    amount: number;
};

export type Recipe = {
    inputs: CraftingRequirement[];
    outputs: RecipeOutput[];
    duration_ms: number;
    // quality depends on inputs quality + npc skills + machine lvl + if everything is done right during production
};

export const RECIPES = {
    sword: {
        inputs: [{ amount: 1, kind: "iron" }],
        outputs: [{ kind: "sword", amount: 1 }],
        duration_ms: 60_000
    },
} satisfies Record<string, Recipe>;
