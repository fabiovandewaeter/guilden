<!-- ui/components/scene/entity_inspect_scene.svelte -->
<script lang="ts">
    import type { EntityId } from "../../../engine/entities/entity.svelte";
    import { scenes, world } from "../../lib/world_controller";

    interface Props {
        entity_id: EntityId;
    }

    let { entity_id }: Props = $props();

    let entity = $derived(world.get_entity(entity_id).unwrap());
</script>

<button onclick={() => scenes.leave_current_scene()}>Return</button>
<h2>{entity.name}</h2>
<p>HP : {entity.max_stats.hp}</p>
