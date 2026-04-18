// ui/states/world_controller.ts
import { Clock } from "../../engine/clock";
import { World } from "../../engine/world.svelte";
import { load_timestamp, save_timestamp } from "./save";
import { DEFAULT_SCENE, SceneManager } from "./scene_manager.svelte";

const world = new World();
const scenes = new SceneManager();
const clock = new Clock();

// ==== zones ==== 
// hub
const hub_id = world.spawn_zone("Hub", "hub");
// buildings
const tavern_id = world.spawn_zone("Tavern", "building")
const forge_id = world.spawn_zone("Forge", "building")

world.connect_zones(hub_id, tavern_id);
world.connect_zones(hub_id, forge_id);

// rooms
const room_a_id = world.spawn_zone("room_a", "room")

world.connect_zones(tavern_id, room_a_id);
// =============== 

// entities
const npc_id = world.spawn_entity(
    "Forgeron",
    forge_id,
    {
        hp: 10,
        mana: 1000,
        attack: 100
    }
);

// init starting scene
scenes.navigate(DEFAULT_SCENE);

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
