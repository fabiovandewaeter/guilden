// engine/world.svelte.ts
import { EntityRepository } from "./entities/entity_repository.svelte";
import type { Entity, EntityId, Stats } from "./entities/entity.svelte";
import type { GameState } from "./game_state";
import { Opt, some } from "./utils/option";
import { BuildingRepository } from "./places/building_repository.svelte";
import { RoomRepository } from "./places/room_repository.svelte";
import type { PlaceRef } from "./places/place_ref.svelte";
import { HubRepository } from "./places/hub_repository.svelte";

export class World {
    private _state: GameState = $state({ mode: "hub" });
    readonly entity_repo: EntityRepository = new EntityRepository();
    readonly hub_repo: HubRepository = new HubRepository();
    readonly building_repo: BuildingRepository = new BuildingRepository();
    readonly room_repo: RoomRepository = new RoomRepository();

    constructor() { }

    get state() { return this._state; }
    set state(state: GameState) { this._state = state; }

    // spawners
    // ========
    /** spawn entity AND move it to the place but fail if assignated place doesn't exist */
    spawn_entity(name: string, place: PlaceRef, max_stats: Stats): EntityId {
        this.place_repo.get_or_err(place).expect(`Cannot spawn entity: Place ${place_id} is missing`);

        let entity_id = this.entity_repo.spawn(name, place_id, max_stats);

        move_entity_to_place(entity_id, place_id, this.place_repo, this.entity_repo);
        return entity_id;
    }

    spawn_place(name: string, kind: PlaceKind): PlaceId {
        return this.place_repo.spawn(name, kind);
    }

    // buildings
    spawn_forge(name: string): PlaceId {
        const building_id = this.building_repo.spawn_forge();
        return this.spawn_place(name, { id: "building", building_id });
    }

    spawn_room(name: string): PlaceId {
        const room_id = this.room_repo.spawn();
        return this.spawn_place(name, { id: "room", room_id });
    }

    // setters
    // =======
    set_current_place_id(place_id: PlaceId) {
        this.current_place_id = some(place_id);
    }

    // deleters
    // ========

    // getters
    // ======= 
    get_entity(id: EntityId): Opt<Entity> { return this.entity_repo.get(id); }
    get_entities(): Entity[] { return this.entity_repo.all(); }
    get_place(id: PlaceId): Opt<Place> { return this.place_repo.get(id); }
    get_places(): Place[] { return this.place_repo.all(); }

    // other
    // ======
    update(delta_ms: number) {
        console.log("Update");
        // this.building_repo.all().forEach(building => {
        //     building.tick(delta_ms);
        // });
        this.place_repo.all_rooms().forEach(room => {
            room.tick(delta_ms);
        });
    }

    debug_manually_advance_time(ms: number) {
        this.update(ms);
    }

    move_entity_to_place(entity_id: EntityId, place_id: PlaceId): void {
        return move_entity_to_place(entity_id, place_id, this.place_repo, this.entity_repo);
    }

    connect_places(place_a_id: PlaceId, place_b_id: PlaceId) {
        return connect_places(place_a_id, place_b_id, this.place_repo);
    }

    // interactions
    // ============
    // start_dialogue(source_id: EntityId, target_id: EntityId): void { return start_dialogue(this, source_id, target_id); }
    // start_trade(source_id: EntityId, target_id: EntityId): void { return start_trade(this, source_id, target_id); }
}
