<!-- ui/components/scene/hub_scene.svelte -->
<script lang="ts">
    import type { HubId } from "../../../engine/places/hub.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        hub_id: HubId;
    }

    let { hub_id }: Props = $props();

    let hub = $derived(world.get_hub(hub_id).unwrap());
    let buildings = $derived(
        hub.buildings.map((id) => world.get_building(id).unwrap()),
    );
    let connected_hubs = $derived(
        hub.connected_hubs.map((id) => world.get_hub(id).unwrap()),
    );
    let npcs = $derived(
        hub.entities.map((id) => world.get_entity(id).unwrap()),
    );
</script>

<h2>{hub.name}</h2>

<h3>Connected hubs</h3>
{#each connected_hubs as h}
    <button onclick={() => scenes.enter_hub(h.id)}>
        {h.name}
    </button>
{/each}

<h3>Buildings</h3>
{#each buildings as b}
    <button onclick={() => scenes.enter_building(b.id)}>
        {b.name}
    </button>
{/each}

<h3>NPCs</h3>
{#each npcs as npc}
    <button onclick={() => scenes.inspect_entity(npc.id)}>
        {npc.name}
    </button>
{/each}
