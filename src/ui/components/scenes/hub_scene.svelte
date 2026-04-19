<!-- ui/components/scene/hub_scene.svelte -->
<script lang="ts">
    import type { PlaceId } from "../../../engine/places/place.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        place_id: PlaceId;
    }

    let { place_id }: Props = $props();

    let place = $derived(world.get_place(place_id).unwrap());
    let buildings = $derived(
        place.connected_places
            .map((id) => world.get_place(id).unwrap())
            .filter((z) => z.kind === "building"),
    );
    let npcs = $derived(
        place.entities.map((id) => world.get_entity(id).unwrap()),
    );
</script>

<h2>{place.name}</h2>

<section>
    <h3>Buildings</h3>
    {#each buildings as building}
        <button onclick={() => scenes.enter_building(building.id)}>
            {building.name}
        </button>
    {/each}
</section>

<section>
    <h3>NPCs</h3>
    {#each npcs as npc}
        <button onclick={() => scenes.inspect_entity(npc.id)}>
            {npc.name}
        </button>
    {/each}
</section>
