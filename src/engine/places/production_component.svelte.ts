// engine/production_component.svelte.ts
import { Inventory } from "../items/inventory.svelte";
import { consume_stackable_items_from_inventory, type CraftingRequirement } from "../items/crafting_service";
import type { InstancedItemRepository } from "../items/instanced_item_repository.svelte";
import { archetype_matches_requirement } from "../items/item_service";
import type { Recipe } from "../items/recipe";
import { Opt, none, some } from "../utils/option";

export class ProductionComponent {
    recipe: Opt<Recipe> = $state(none);
    readonly input: Inventory = new Inventory();
    readonly output: Inventory = new Inventory();
    public leftover_ms: number = $state(0);

    constructor(recipe: Recipe) {
        this.recipe = some(recipe);
    }

    /** it is running if we have enough materials in the input inventory */
    get is_running(): boolean {
        if (!this.recipe.is_some()) return false;
        return this.can_craft(this.recipe.value.inputs);
    }

    get progress_percentage(): number {
        if (!this.recipe.is_some()) return 0;
        return (this.leftover_ms / this.recipe.value.duration_ms) * 100;
    }

    tick(delta_ms: number, instanced_item_repo: InstancedItemRepository) {
        if (!this.recipe.is_some()) return;

        const recipe = this.recipe.value;
        this.leftover_ms += delta_ms;

        const cycles = Math.floor(this.leftover_ms / recipe.duration_ms);
        if (cycles === 0) return;

        this.leftover_ms %= recipe.duration_ms;

        for (let i = 0; i < cycles; i++) {
            if (!this.can_craft(recipe.inputs)) {
                break;
            }

            // 1. Consume the requirements
            this.consume_inputs(recipe.inputs);

            // 2. Generate the outputs
            recipe.outputs.forEach(out => {
                // TODO: calculate dynamic stats here based on consumed items + npc skills + machine lvl + processus quality
                const calculated_quality = "Common";
                const calculated_level = 1;

                if (out.is_instanced) {
                    for (let j = 0; j < out.amount; j++) {
                        const new_item_id = instanced_item_repo.spawn(
                            out.kind,
                            out.kind,
                            calculated_quality,
                            calculated_level
                        );
                        this.output.add_instanced(new_item_id);
                    }
                } else {
                    this.output.add_stackable(
                        { kind: out.kind, quality: calculated_quality, level: calculated_level },
                        out.amount
                    );
                }
            });
        }
    }

    private can_craft(requirements: CraftingRequirement[]): boolean {
        // Create a fast, temporary map of available quantities using the archetype hashes
        const sim_amounts: Record<string, number> = {};
        for (const [hash, stack] of Object.entries(this.input.stackable_items)) {
            sim_amounts[hash] = stack.amount;
        }

        for (const req of requirements) {
            let needed = req.amount;

            for (const [hash, amount_available] of Object.entries(sim_amounts)) {
                const archetype = this.input.stackable_items[hash].archetype;

                if (amount_available > 0 && archetype_matches_requirement(archetype, req)) {
                    const take = Math.min(amount_available, needed);
                    sim_amounts[hash] -= take;
                    needed -= take;
                }
                if (needed === 0) break;
            }

            if (needed > 0) return false;
        }
        return true;
    }

    private consume_inputs(requirements: CraftingRequirement[]) {
        for (const req of requirements) {
            consume_stackable_items_from_inventory(this.input, req).assert_ok();
        }
    }
}
