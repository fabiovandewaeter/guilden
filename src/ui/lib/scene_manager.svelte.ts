// src/ui/scene_manager.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import type { ZoneId } from "../../engine/map/zone.svelte";
import type { Scene } from "./scene";

export class SceneManager {
    current: Scene = $state({ id: "hub", zone_id: 0 });

    navigate(scene: Scene) {
        this.current = scene;
    }

    enter_building(zone_id: ZoneId) {
        this.navigate({ id: "building", zone_id });
    }

    inspect_entity(entity_id: EntityId) {
        this.navigate({ id: "entity_inspect", entity_id, from: this.current });
    }

    /** returns to previous scene or to hub if no previous scene */
    leave_current_scene() {
        console.log(this.current)
        if (this.current.id === "entity_inspect") {
            this.current = this.current.from;
        }
        else {
            this.current = { id: "hub", zone_id: 0 };
        }
    }
}
