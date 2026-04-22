<!-- ui/components/production_view.svelte -->
<script lang="ts">
    import type { ProductionComponent } from "../../engine/places/production_component.svelte";

    interface Props {
        production: ProductionComponent;
    }

    let { production }: Props = $props();
</script>

<div>
    <div>
        <h3>Status</h3>
        {#if production.recipe.is_some()}
            {@const recipe = production.recipe.value}

            <p>
                <strong>Crafting:</strong>
                {recipe.outputs[0].kind} ({recipe.duration_ms / 1000}s)
            </p>

            {#if production.is_running}
                <p>🟢 Running</p>
                <progress value={production.progress_percentage} max="100"
                ></progress>
            {:else}
                <p>🔴 Stopped: Missing Input Materials</p>
                <progress value="0" max="100"></progress>
            {/if}
        {:else}
            <p>No recipe selected.</p>
        {/if}
    </div>

    <div>
        <div>
            <h3>Input Stock</h3>
            <ul>
                {#each Object.values(production.input.stackable_items) as stack}
                    <li>
                        {stack.amount}x {stack.archetype.kind} ({stack.archetype
                            .quality})
                    </li>
                {/each}

                {#if Object.keys(production.input.stackable_items).length === 0}
                    <li>Empty</li>
                {/if}
            </ul>
        </div>

        <div>
            <h3>Output Stock</h3>
            <ul>
                {#each Object.values(production.output.stackable_items) as stack}
                    <li>
                        {stack.amount}x {stack.archetype.kind} ({stack.archetype
                            .quality})
                    </li>
                {/each}

                {#each Array.from(production.output.instanced_items) as id}
                    <li>Unique Item (ID: {id})</li>
                {/each}

                {#if Object.keys(production.output.stackable_items).length === 0 && Array.from(production.output.instanced_items).length === 0}
                    <li>Empty</li>
                {/if}
            </ul>
        </div>
    </div>
</div>
