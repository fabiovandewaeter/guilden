// ui/states/world_controller.ts
import { World } from "../../engine/world.svelte";
import { DEFAULT_SCENE, SceneManager } from "./scene_manager.svelte";

const world = new World();
const scenes = new SceneManager();

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
).unwrap();

// init starting scene
scenes.navigate(DEFAULT_SCENE);

setInterval(() => {
    world.update();
}, 5000);

export { world, scenes };
