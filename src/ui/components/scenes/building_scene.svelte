<!-- ui/components/scene/building_scene.svelte -->
<script lang="ts">
    import type { ZoneId } from "../../../engine/zones/zone.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        zone_id: ZoneId;
    }

    let { zone_id }: Props = $props();

    let building = $derived(world.get_zone(zone_id).unwrap());
    let rooms = $derived(
        building.connected_zones
            .map((id) => world.get_zone(id).unwrap())
            .filter((z) => z.kind === "room"),
    );
    let npcs = $derived(
        building.entities.map((id) => world.get_entity(id).unwrap()),
    );
</script>

<button onclick={() => scenes.leave_current_scene()}>Return</button>
<h2>{building.name}</h2>

<section>
    <h3>random things</h3>
    <p>sword: {building.swords}</p>
    <p>leftover_ms: {building.leftover_ms}</p>
</section>

<section>
    <h3>Rooms</h3>
    {#each rooms as room}
        <button onclick={() => scenes.enter_room(room.id)}>
            {room.name}
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
