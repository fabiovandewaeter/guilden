<!-- ui/components/scene/hub_scene.svelte -->
<script lang="ts">
    import type { ZoneId } from "../../../engine/map/zone.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        zone_id: ZoneId;
    }

    let { zone_id }: Props = $props();

    let zone = $derived(world.get_zone(zone_id).unwrap());
    let buildings = $derived(
        zone.connected_zones
            .map((id) => world.get_zone(id).unwrap())
            .filter((z) => z.kind === "building"),
    );
    let npcs = $derived(
        zone.entities.map((id) => world.get_entity(id).unwrap()),
    );
</script>

<h2>{zone.name}</h2>

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
