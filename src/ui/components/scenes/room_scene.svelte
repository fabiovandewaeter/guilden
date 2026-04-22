<!-- ui/components/scene/room_scene.svelte -->
<script lang="ts">
    import type { RoomId } from "../../../engine/places/room.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        room_id: RoomId;
    }

    let { room_id }: Props = $props();

    let room = $derived(world.get_room(room_id).unwrap());
    let connected_rooms = $derived(
        room.connected_rooms.map((id) => world.get_room(id).unwrap()),
    );
    let npcs = $derived(
        room.entities.map((id) => world.get_entity(id).unwrap()),
    );
</script>

<button onclick={() => scenes.back()}>Return</button>
<h2>{room.name}</h2>

<h3>Connected Rooms</h3>
{#each connected_rooms as r}
    <button onclick={() => scenes.enter_room(r.id)}>
        {r.name}
    </button>
{/each}

<h3>NPCs</h3>
{#each npcs as npc}
    <button onclick={() => scenes.inspect_entity(npc.id)}>
        {npc.name}
    </button>
{/each}
