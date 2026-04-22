// src/ui/scene_manager.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import type { BuildingId } from "../../engine/places/building.svelte";
import type { HubId } from "../../engine/places/hub.svelte";
import type { RoomId } from "../../engine/places/room.svelte";
import type { Scene } from "./scene";

export const DEFAULT_SCENE: Scene = { id: "ERROR", message: "Default scene" };

export class SceneManager {
    current: Scene = $state(DEFAULT_SCENE);
    private history: Scene[] = [];
    private readonly MAX_HISTORY = 3;

    private navigate(scene: Scene) {
        if (this.history.length > this.MAX_HISTORY) {
            this.history.shift();
        }
        this.history.push(this.current);
        this.current = scene;
    }

    enter_hub(hub_id: HubId) {
        this.navigate({ id: "hub", hub_id });
    }

    enter_building(building_id: BuildingId) {
        this.navigate({ id: "building", building_id });
    }

    enter_room(room_id: RoomId) {
        this.navigate({ id: "room", room_id });
    }

    inspect_entity(entity_id: EntityId) {
        this.navigate({ id: "entity_inspect", entity_id });
    }

    /** returns to previous scene or to hub if no previous scene */
    back() {
        this.current = this.history.pop() ?? DEFAULT_SCENE;
    }
}
