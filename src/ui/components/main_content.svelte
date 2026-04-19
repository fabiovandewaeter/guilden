<!-- ui/components/main_content.svelte -->
<script lang="ts">
    import { clock, scenes, world } from "../lib/world_controller";
    import BuildingScene from "./scenes/building_scene.svelte";
    import EntityInspectScene from "./scenes/entity_inspect_scene.svelte";
    import HubScene from "./scenes/hub_scene.svelte";
    import RoomScene from "./scenes/room_scene.svelte";

    let current_game_state = $derived(world.state.mode);

    let scene = $derived(scenes.current);
</script>

<div class="main-content">
    <button onclick={() => world.debug_manually_advance_time(60_000)}
        >+1 min</button
    >
    <button onclick={() => world.debug_manually_advance_time(3_600_000)}
        >+1 heure</button
    >
    <p>{clock.timestamp}</p>
    {#if scene.id === "hub"}
        <HubScene place_id={scene.place_id} />
    {:else if scene.id === "building"}
        <BuildingScene place_id={scene.place_id} />
    {:else if scene.id === "room"}
        <RoomScene place_id={scene.place_id} />
    {:else if scene.id === "entity_inspect"}
        <EntityInspectScene entity_id={scene.entity_id} />
    {/if}
</div>

<style>
    .main-content {
        background-color: #f6bfd496;
        padding: 20px;
    }
</style>
