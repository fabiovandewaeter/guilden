<!-- ui/components/scene/room_scene.svelte -->
<script lang="ts">
    import type { PlaceId } from "../../../engine/places/place.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        place_id: PlaceId;
    }

    let { place_id }: Props = $props();

    let building = $derived(world.get_place(place_id).unwrap());
    let rooms = $derived(
        building.connected_places
            .map((id) => world.get_place(id).unwrap())
            .filter((z) => z.kind === "room"),
    );
    let npcs = $derived(
        building.entities.map((id) => world.get_entity(id).unwrap()),
    );
</script>

<button onclick={() => scenes.leave_current_scene()}>Return</button>
<h2>{building.name}</h2>

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
