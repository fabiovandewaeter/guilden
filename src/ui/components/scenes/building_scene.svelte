<!-- ui/components/scene/building_scene.svelte -->
<script lang="ts">
    import type { BuildingId } from "../../../engine/places/building.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        building_id: BuildingId;
    }

    let { building_id }: Props = $props();

    let building = $derived(world.get_building(building_id).unwrap());
    let rooms = $derived(
        building.rooms.map((id) => world.get_room(id).unwrap()),
    );
</script>

<button onclick={() => scenes.back()}>Return</button>
<h2>{building.name}</h2>

<h3>Rooms</h3>
{#each rooms as room}
    <button onclick={() => scenes.enter_room(room.id)}>
        {room.name}
    </button>
{/each}
