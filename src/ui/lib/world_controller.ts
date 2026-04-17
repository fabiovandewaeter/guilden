// ui/states/world_controller.ts
import { World } from "../../engine/world.svelte";
import { SceneManager } from "./scene_manager.svelte";

const world = new World();
const scenes = new SceneManager();

// rooms
const hub_id = world.spawn_zone("Hub", "hub");
const tavern_id = world.spawn_zone("Tavern", "building")
const forge_id = world.spawn_zone("Forge", "building")

world.connect_zones(hub_id, tavern_id);
world.connect_zones(hub_id, forge_id);

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
scenes.navigate({ id: "hub", zone_id: hub_id });

setInterval(() => {
    world.update();
}, 5000);

export { world, scenes };
