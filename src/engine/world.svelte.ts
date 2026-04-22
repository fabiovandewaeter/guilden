// engine/world.svelte.ts
import { EntityRepository } from "./entities/entity_repository.svelte";
import type { Entity, EntityId, Stats } from "./entities/entity.svelte";
import type { GameState } from "./game_state";
import { Opt, some } from "./utils/option";
import { BuildingRepository } from "./places/building_repository.svelte";
import { RoomRepository } from "./places/room_repository.svelte";
import type { PlaceRef } from "./places/place_ref.svelte";
import { HubRepository } from "./places/hub_repository.svelte";
import type { Hub, HubId } from "./places/hub.svelte";
import type { Building, BuildingId } from "./places/building.svelte";
import type { Room, RoomId } from "./places/room.svelte";
import { connect_hubs, connect_rooms, move_entity, spawn_forge } from "./places/place_service";
import { InstancedItemRepository } from "./items/instanced_item_repository.svelte";

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
    spawn_entity(name: string, place: PlaceRef, max_stats: Stats): EntityId {
        this._resolve_place(place).expect(`Cannot spawn entity: place ${JSON.stringify(place)} not found`);
        let entity_id = this.entity_repo.spawn(name, place, max_stats);
        // move_entity(entity_id, place_id, this.place_repo, this.entity_repo);
        return entity_id;
    }

    spawn_hub(name: string): HubId { return this.hub_repo.spawn(name); }

    spawn_building(name: string): BuildingId { return this.building_repo.spawn(name); }
    /** a building with a production room */
    spawn_forge(name: string): { building_id: BuildingId, room_id: RoomId } {
        return spawn_forge(name, this.building_repo, this.room_repo);
    }

    spawn_room(name: string): RoomId { return this.room_repo.spawn(name); }


    // ==========================================
    // GETTERS
    // ==========================================
    get_entity(id: EntityId): Opt<Entity> { return this.entity_repo.get(id); }
    get_entities(): Entity[] { return this.entity_repo.all(); }
    get_hub(id: HubId): Opt<Hub> { return this.hub_repo.get(id); }
    get_building(id: BuildingId): Opt<Building> { return this.building_repo.get(id); }
    get_room(id: RoomId): Opt<Room> { return this.room_repo.get(id); }

    get_hubs(): Hub[] { return this.hub_repo.all(); }
    get_buildings(): Building[] { return this.building_repo.all(); }
    get_rooms(): Room[] { return this.room_repo.all(); }

    // ==========================================
    // OTHER
    // ==========================================
    update(delta_ms: number) {
        console.log("Update " + delta_ms / 1000 + " s");
        this.get_rooms().forEach(room => {
            room.tick(delta_ms, this.instanced_item_repo);
        });
    }

    debug_manually_advance_time(ms: number) { this.update(ms); }

    move_entity(entity_id: EntityId, place_ref: PlaceRef): void { return move_entity(entity_id, place_ref, this, this.entity_repo); }

    connect_hubs(a: HubId, b: HubId) { return connect_hubs(a, b, this); }
    connect_rooms(a: RoomId, b: RoomId) { return connect_rooms(a, b, this); }

    // ==========================================
    // PRIVATE
    // ==========================================
    /** reads the PlaceRef and returns the corresponding Hub or Room */
    private _resolve_place(ref: PlaceRef): Opt<Hub | Room> {
        if (ref.tag === 'room') return this.room_repo.get(ref.id);
        return this.hub_repo.get(ref.id);
    }
}
