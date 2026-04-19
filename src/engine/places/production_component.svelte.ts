// engine/production_component.svelte.ts
import { Inventory } from "../inventory.svelte";
import type { CraftingRequirement } from "../items/crafting_service";
import type { ItemRepository } from "../items/item_repository.svelte";
import { matches_requirement } from "../items/item_service";
import type { Recipe } from "../recipe";
import { Opt, none } from "../utils/option";

export class ProductionComponent {
    recipe: Opt<Recipe> = $state(none);
    readonly input: Inventory = new Inventory();
    readonly output: Inventory = new Inventory();
    public leftover_ms: number = $state(0);

    tick(delta_ms: number, item_repo: ItemRepository) {
        if (!this.recipe.is_some()) return;

        const recipe = this.recipe.value;
        this.leftover_ms += delta_ms;

        const cycles = Math.floor(this.leftover_ms / recipe.duration_ms);
        if (cycles === 0) return;

        this.leftover_ms %= recipe.duration_ms;

        for (let i = 0; i < cycles; i++) {
            if (!this.can_craft(recipe.inputs, item_repo)) {
                break;
            }

            // 1. Consume the requirements
            this.consume_inputs(recipe.inputs, item_repo);

            // 2. Generate the outputs
            recipe.outputs.forEach(out => {
                // TODO: calculate dynamic stats here based on consumed items + npc skills + machine lvl + processus quality
                const calculated_quality = "Common";
                const calculated_level = 1;

                const new_item_id = item_repo.spawn(
                    out.kind,
                    out.kind,
                    calculated_quality,
                    calculated_level
                );

                this.output.add(new_item_id, out.amount);
            });
        }
    }

    private can_craft(requirements: CraftingRequirement[], item_repo: ItemRepository): boolean {
        const simulated_inventory = new Map(this.input.items.map(s => [s.item_id, s.amount]));

        for (const req of requirements) {
            let needed = req.amount;

            for (const [id, amount] of simulated_inventory.entries()) {
                if (amount > 0 && matches_requirement(id, req, item_repo)) {
                    const take = Math.min(amount, needed);
                    simulated_inventory.set(id, amount - take);
                    needed -= take;
                }
                if (needed === 0) break;
            }

            if (needed > 0) return false;
        }
        return true;
    }

    private consume_inputs(requirements: CraftingRequirement[], repo: ItemRepository) {
        for (const req of requirements) {
            let needed = req.amount;

            for (const stack of [...this.input.items]) {
                if (matches_requirement(stack.item_id, req, repo)) {
                    const take = Math.min(stack.amount, needed);

                    this.input.remove(stack.item_id, take).assert_ok();
                    needed -= take;
                }
                if (needed === 0) break;
            }
        }
    }
}
