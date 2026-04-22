// engine/items/recipe.ts
import type { CraftingRequirement } from "./crafting_service";
import type { ItemKind } from "./item_kind";

export type RecipeOutput = {
    kind: ItemKind;
    amount: number;
    is_instanced: boolean;
};

export type Recipe = {
    inputs: CraftingRequirement[];
    outputs: RecipeOutput[];
    duration_ms: number;
    // quality depends on inputs quality + npc skills + machine lvl + if everything is done right during production
};

export const RECIPES = {
    iron_ingot: {
        inputs: [{ amount: 2, kind: "iron_ore" }],
        outputs: [{ kind: "iron_ingot", amount: 1, is_instanced: false }],
        duration_ms: 10_000
    },
    sword: {
        inputs: [{ amount: 1, kind: "iron_ingot" }],
        outputs: [{ kind: "sword", amount: 1, is_instanced: true }],
        duration_ms: 60_000
    },
} satisfies Record<string, Recipe>;
