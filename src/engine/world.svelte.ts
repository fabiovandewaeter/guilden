// engine/world.svelte.ts
import { EntityRepository } from "./entities/entity_repository.svelte";
import type { Entity, EntityId, Stats } from "./entities/entity.svelte";
import type { GameState } from "./game_state";
import { Opt, none, some } from "./utils/option";
import { Result, err, ok } from "./utils/result";
import type { Zone, ZoneId, ZoneKind } from "./map/zone.svelte";
import { ZoneRepository } from "./map/zone_repository.svelte";
import { move_entity_to_zone, connect_zones } from "./map/zone_service";

export class World {
    private _state: GameState = $state({ mode: "hub" });
    private current_zone_id: Opt<ZoneId> = $state(none);
    readonly entity_repo: EntityRepository = new EntityRepository();
    readonly zone_repo: ZoneRepository = new ZoneRepository();

    constructor() { }

    get state() { return this._state; }
    get current_zone(): Opt<Zone> {
        return this.current_zone_id.is_some()
            ? this.get_zone(this.current_zone_id.value)
            : none;
    }

    set state(state: GameState) { this._state = state; }

    // spawners
    // ========
    /** spawn entity AND move it to the zone but fail if assignated zone doesn't exist */
    spawn_entity(name: string, zone_id: ZoneId, max_stats: Stats): Result<EntityId, string> {
        let zone_res = this.zone_repo.get_or_err(zone_id);
        if (zone_res.is_err()) return err(zone_res.error);

        let entity_id_res = this.entity_repo.spawn(name, zone_id, max_stats);
        if (entity_id_res.is_err()) return err(entity_id_res.error);
        let entity_id = entity_id_res.unwrap();

        let res = move_entity_to_zone(entity_id, zone_id, this.zone_repo, this.entity_repo);
        if (res.is_err()) return err(res.error);
        return ok(entity_id);
    }

    spawn_zone(name: string, kind: ZoneKind): ZoneId {
        return this.zone_repo.spawn(name, kind);
    }

    // setters
    // =======
    set_current_zone_id(zone_id: ZoneId) {
        this.current_zone_id = some(zone_id);
    }

    // deleters
    // ========

    // getters
    // ======= 
    get_entity(id: EntityId): Opt<Entity> {
        return this.entity_repo.get(id);
    }
    get_entities(): Entity[] {
        return this.entity_repo.all();
    }
    get_zone(id: ZoneId): Opt<Zone> {
        return this.zone_repo.get(id);
    }
    get_zones(): Zone[] {
        return this.zone_repo.all();
    }

    // other
    // ======
    update() {
        console.log("Update");
    }

    move_entity_to_zone(entity_id: EntityId, zone_id: ZoneId): Result<void, string> {
        return move_entity_to_zone(entity_id, zone_id, this.zone_repo, this.entity_repo);
    }

    connect_zones(zone_a_id: ZoneId, zone_b_id: ZoneId) {
        return connect_zones(zone_a_id, zone_b_id, this.zone_repo);
    }

    // interactions
    // ============
    // start_dialogue(source_id: EntityId, target_id: EntityId): void { return start_dialogue(this, source_id, target_id); }
    // start_trade(source_id: EntityId, target_id: EntityId): void { return start_trade(this, source_id, target_id); }
}
