// ui/states/world_controller.ts
import { Clock } from "../../engine/clock";
import { ARCHETYPES } from "../../engine/entities/archetype";
import { PROFESSIONS } from "../../engine/entities/profession";
import { SPECIES } from "../../engine/entities/species";
import { RECIPES, type RecipeOutput } from "../../engine/items/recipe";
import { connect_rooms, spawn_forge } from "../../engine/places/place_service";
import { ProductionComponent } from "../../engine/places/production_component.svelte";
import { some } from "../../engine/utils/option";
import { World } from "../../engine/world.svelte";
import { load_timestamp, save_timestamp } from "./save";
import { SceneManager } from "./scene_manager.svelte";

const world = new World();
const scenes = new SceneManager();
const clock = new Clock();

// ==========================================
// PLACES
// ==========================================
// hub
const hub_id = world.hub_repo.spawn("Hub");
// buildings
const { building_id: forge_id, room_id: forge_room_id } = spawn_forge("Forge", world.building_repo, world.room_repo);
world.hub_repo.get(hub_id).expect(`Can connect forge to hub: Hub ${hub_id} not found`).add_building(forge_id).assert_ok();
const forge_room = world.room_repo.get(forge_room_id).unwrap();
forge_room.production = some(new ProductionComponent(RECIPES.iron_ingot));
forge_room.production.unwrap().input.add_stackable({
    kind: "iron_ore",
    quality: "Broken",
    level: 0
}, 2000);

// rooms
const room_a_id = world.room_repo.spawn("Room A")
connect_rooms(forge_room_id, room_a_id, world);

// ==========================================
// ENTITIES
// ==========================================
const npc_id = world.spawn_entity(
    "Forgeron",
    { tag: "room", id: forge_room_id },
    {
        hp: 10,
        mana: 1000,
        attack: 100
    },
    SPECIES.human,
    ARCHETYPES.tank,
    PROFESSIONS.blacksmith,
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
