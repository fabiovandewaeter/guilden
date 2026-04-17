<!-- ui/components/main_content.svelte -->
<script lang="ts">
    import { scenes, world } from "../lib/world_controller";
    import BuildingScene from "./scenes/building_scene.svelte";
    import EntityInspectScene from "./scenes/entity_inspect_scene.svelte";
    import HubScene from "./scenes/hub_scene.svelte";

    let current_game_state = $derived(world.state.mode);

    let scene = $derived(scenes.current);
</script>

<div class="main-content">
    {#if scene.id === "hub"}
        <HubScene zone_id={scene.zone_id} />
    {:else if scene.id === "building"}
        <BuildingScene zone_id={scene.zone_id} />
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
