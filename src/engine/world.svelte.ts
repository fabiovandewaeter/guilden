// engine/world.svelte.ts
import { EntityRepository } from "./entities/entity_repository.svelte";
import type { EntityId, Stats } from "./entities/entity.svelte";
import type { GameState } from "./game_state";
import { BuildingRepository } from "./places/building_repository.svelte";
import { RoomRepository } from "./places/room_repository.svelte";
import type { PlaceRef } from "./places/place_ref.svelte";
import { HubRepository } from "./places/hub_repository.svelte";
import { move_entity, resolve_place } from "./places/place_service";
import { InstancedItemRepository } from "./items/instanced_item_repository.svelte";
import type { Species } from "./entities/species";
import type { Archetype } from "./entities/archetype";
import type { Profession } from "./entities/profession";

export class World {
    private _state: GameState = $state({ mode: "hub" });

    readonly entity_repo: EntityRepository = new EntityRepository();
    readonly hub_repo: HubRepository = new HubRepository();
    readonly building_repo: BuildingRepository = new BuildingRepository();
    readonly room_repo: RoomRepository = new RoomRepository();

    readonly instanced_item_repo: InstancedItemRepository = new InstancedItemRepository();

    constructor() { }

    get state() { return this._state; }
    set state(state: GameState) { this._state = state; }

    // ==========================================
    // SPAWNERS
    // ==========================================
    /** spawn entity AND move it to the place but fail if assignated place doesn't exist */
    spawn_entity(name: string, place_ref: PlaceRef, max_stats: Stats, species: Species, archetype: Archetype, profession: Profession): EntityId {
        resolve_place(place_ref, this);
        let entity_id = this.entity_repo.spawn(name, max_stats, species, archetype, profession);
        move_entity(entity_id, place_ref, this, this.entity_repo);
        return entity_id;
    }

    // ==========================================
    // OTHER
    // ==========================================
    update(delta_ms: number) {
        console.log("Update " + delta_ms / 1000 + " s");
        this.room_repo.all().forEach(room => {
            room.tick(delta_ms, this.instanced_item_repo);
        });
    }

    debug_manually_advance_time(ms: number) { this.update(ms); }
}
