// engine/core/world.svelte.ts

import type { EntityArchetype } from "../entities/entity_archetype";
import { type EntityRepository, Entity, type EntityId, type Stats } from "../entities/entity.svelte";
import type { Profession } from "../entities/profession";
import type { Species } from "../entities/species";
import { InstancedItem, type InstancedItemId } from "../items/instanced_item.svelte";
import type { ItemArchetype } from "../items/item_archetype";
import { Building, type BuildingId } from "../places/building.svelte";
import { Hub, type HubId } from "../places/hub.svelte";
import type { PlaceRef } from "../places/place_ref.svelte";
import { Room, type RoomId } from "../places/room.svelte";
import { resolve_place, move_entity } from "../places/place_service";
import { tick_production } from "../production/production_service";
import { none } from "../utils/option";
import type { GameState } from "./game_state";
import { Repository } from "./repository.svelte";
import { Clock } from "./clock.svelte";


export class World {
    private _state: GameState = $state({ mode: "hub" });

    // readonly entity_repo: EntityRepository = new EntityRepository();
    readonly entity_repo: EntityRepository = new Repository<Entity, EntityId, [string, Stats, Species, EntityArchetype, Profession]>((id, name, max_stats, species, archetype, profession) => new Entity(id, name, none, max_stats, species, archetype, profession));
    readonly hub_repo = new Repository<Hub, HubId, [string]>((id, name) => new Hub(id, name));
    readonly building_repo = new Repository<Building, BuildingId, [string]>((id, name) => new Building(id, name));
    readonly room_repo = new Repository<Room, RoomId, [string]>((id, name) => new Room(id, name));
    readonly instanced_item_repo = new Repository<InstancedItem, InstancedItemId, [string, ItemArchetype]>((id, name, archetype) => new InstancedItem(id, name, archetype));

    readonly clock: Clock = new Clock();

    constructor() { }

    get state() { return this._state; }
    set state(state: GameState) { this._state = state; }

    // ==========================================
    // SPAWNERS
    // ==========================================
    /** spawn entity AND move it to the place but fail if assignated place doesn't exist */
    spawn_entity(name: string, place_ref: PlaceRef, max_stats: Stats, species: Species, archetype: EntityArchetype, profession: Profession): EntityId {
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
            // room.tick(delta_ms, this.instanced_item_repo);
            if (room.production.is_some()) {
                tick_production(room.production.value, delta_ms, this.instanced_item_repo);
            }
        });
    }

    debug_manually_advance_time(ms: number) {
        this.clock.advance_by(ms);
        this.update(ms);
    }
}
