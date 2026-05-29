// engine/production/production_component.svelte.ts
import { Inventory } from "../items/inventory.svelte";
import type { Recipe } from "./recipe";
import { Opt, none, some } from "../utils/option";
import { is_production_running } from "./production_service";

export class ProductionComponent {
    recipe: Opt<Recipe> = $state(none);
    readonly input: Inventory = new Inventory();
    readonly output: Inventory = new Inventory();
    public leftover_ms: number = $state(0);

    constructor(recipe: Recipe) {
        this.recipe = some(recipe);
    }

    /** it is running if it has enough materials in the input inventory */
    get is_running(): boolean {
        return is_production_running(this);
    }

    get progress_percentage(): number {
        if (!this.recipe.is_some()) return 0;
        return (this.leftover_ms / this.recipe.value.duration_ms) * 100;
    }
}
