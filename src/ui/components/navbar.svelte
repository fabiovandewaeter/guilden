<!-- ui/components/navbar.svelte -->
<script lang="ts">
    import type { HubId } from "../../engine/places/hub.svelte";
    import { scenes } from "../lib/world_controller";
</script>

<div class="navbar">
    <h2>Navbar</h2>
    <button onclick={() => scenes.enter_hub(0 as HubId)}>Hub</button>
</div>

<style>
    .navbar {
        background-color: #444;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: start;
        padding: 10px;
    }
</style>
