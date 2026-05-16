// engine/production_component.svelte.ts
import { Inventory } from "../items/inventory.svelte";
import { consume_stackable_items_from_inventory, type CraftingRequirement } from "../items/crafting_service";
import type { InstancedItemRepository } from "../items/instanced_item_repository.svelte";
import { archetype_matches_requirement } from "../items/item_service";
import type { Recipe } from "../items/recipe";
import { Opt, none, some } from "../utils/option";
import type { ItemArchetype } from "../items/item_archetype";

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
        return this._can_craft(this.recipe.value.inputs);
    }

    get progress_percentage(): number {
        if (!this.recipe.is_some()) return 0;
        return (this.leftover_ms / this.recipe.value.duration_ms) * 100;
    }

    tick(delta_ms: number, instanced_item_repo: InstancedItemRepository) {
        if (!this.recipe.is_some()) return;
        const recipe = this.recipe.value;

        this.leftover_ms += delta_ms;
        const total_cycles = Math.floor(this.leftover_ms / recipe.duration_ms);
        if (total_cycles === 0) return;
        this.leftover_ms %= recipe.duration_ms;

        const feasible_cycles = this._max_feasible_cycles(recipe.inputs, total_cycles);
        if (feasible_cycles === 0) return;

        this._consume_inputs_bulk(recipe.inputs, feasible_cycles);

        // 2. Generate the outputs
        recipe.outputs.forEach(out => {
            // TODO: calculate dynamic stats here based on consumed items + npc skills + machine lvl + processus quality
            const total_amount = out.amount * feasible_cycles;
            const calculated_quality = "Common";
            const calculated_level = 1;

            // TODO: limits or changes fastfoward for instanced_items because it still needs a loop to catch up
            if (out.is_instanced) {
                for (let j = 0; j < total_amount; j++) {
                    const new_item_id = instanced_item_repo.spawn(
                        out.kind, out.kind, calculated_quality, calculated_level
                    );
                    this.output.add_instanced(new_item_id);
                }
            } else {
                this.output.add_stackable(
                    { kind: out.kind, quality: calculated_quality, level: calculated_level },
                    total_amount
                );
            }
        });
    }

    /** Returns how many cycles can be returns the number of cycles that can be performed with the current stock, capped by max_cycles (we will either be limited by the stock or by the time that has passed since the last update) */
    private _max_feasible_cycles(requirements: CraftingRequirement[], max_cycles: number): number {
        // snapshots of quantities
        const available: Record<string, { archetype: ItemArchetype, amount: number }> = {};
        for (const [hash, stack] of Object.entries(this.input.stackable_items)) {
            available[hash] = { ...stack };
        }

        let feasible = max_cycles;

        for (const req of requirements) {
            let total_available_for_req = 0;
            for (const stack of Object.values(available)) {
                if (archetype_matches_requirement(stack.archetype, req)) {
                    total_available_for_req += stack.amount;
                }
            }
            const cycle_for_this_req = Math.floor(total_available_for_req / req.amount);
            feasible = Math.min(feasible, cycle_for_this_req);
        }

        return feasible;
    }

    private _consume_inputs_bulk(requirements: CraftingRequirement[], cycles: number) {
        for (const req of requirements) {
            const scaled_req: CraftingRequirement = { ...req, amount: req.amount * cycles };
            consume_stackable_items_from_inventory(this.input, scaled_req).assert_ok();
        }
    }

    private _can_craft(requirements: CraftingRequirement[]): boolean {
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
}
