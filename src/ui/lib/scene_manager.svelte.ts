// src/ui/scene_manager.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import type { PlaceId } from "../../engine/places/place.svelte";
import { none, Opt, some } from "../../engine/utils/option";
import type { Scene } from "./scene";

export const DEFAULT_SCENE: Scene = { id: "hub", place_id: 0, from: none };

export class SceneManager {
    current: Scene = $state(DEFAULT_SCENE);

    navigate(scene: Scene) {
        this.current = scene;
    }

    enter_building(place_id: PlaceId) {
        this.navigate({ id: "building", place_id, from: some(this.current) });
    }

    enter_room(place_id: PlaceId) {
        this.navigate({ id: "room", place_id, from: some(this.current) });
    }

    inspect_entity(entity_id: EntityId) {
        this.navigate({ id: "entity_inspect", entity_id, from: some(this.current) });
    }

    /** returns to previous scene or to hub if no previous scene */
    leave_current_scene() {
        if (this.current.from.is_none()) {
            this.current = DEFAULT_SCENE;
        }
        else if (this.current.from.is_some()) {
            this.current = this.current.from.value;
        }
    }
}
