// ui/states/world_controller.ts
import { Clock } from "../../engine/clock";
import { World } from "../../engine/world.svelte";
import { load_timestamp, save_timestamp } from "./save";
import { DEFAULT_SCENE, SceneManager } from "./scene_manager.svelte";

const world = new World();
const scenes = new SceneManager();
const clock = new Clock();

// === places =====================================================================
// hub
const hub_id = world.spawn_hub("Hub");
// buildings
const { building_id: forge_id, room_id: forge_room_id } = world.spawn_forge("Forge")
world.hub_repo.get(hub_id).expect(`Can connect forge to hub: Hub ${hub_id} not found`).add_building(forge_id).assert_ok();

// rooms
const room_a_id = world.spawn_room("Room A")
world.connect_rooms(forge_room_id, room_a_id);

// === entities ===================================================================
const npc_id = world.spawn_entity(
    "Forgeron",
    { tag: "room", id: forge_room_id },
    {
        hp: 10,
        mana: 1000,
        attack: 100
    }
);

// init starting scene
scenes.enter_hub(hub_id);

// save/timestamp
const saved_timestamp = load_timestamp();
if (saved_timestamp.is_some()) {
    const missed_ms = Date.now() - saved_timestamp.value;
    if (missed_ms > 0) world.debug_manually_advance_time(missed_ms);
}

setInterval(() => {
    const delta = clock.tick();
    world.update(delta);
    save_timestamp(clock.timestamp);
}, 5000);

// save before closing the window
window.addEventListener("beforeunload", () => {
    save_timestamp(Date.now());
});

export { world, scenes, clock };
