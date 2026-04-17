// engine/map/zone.ts
import type { EntityId } from "../entities/entity.svelte";
import type { EntityRepository } from "../entities/entity_repository.svelte";
import { none, some } from "../utils/option";
import { ok, type Result } from "../utils/result";
import type { ZoneId } from "./zone.svelte";
import type { ZoneRepository } from "./zone_repository.svelte";

export function move_entity_to_zone(entity_id: EntityId, new_zone_id: ZoneId, zone_repo: ZoneRepository, entity_repo: EntityRepository): Result<void, string> {
    // let new_zone_res = zone_repo.get_or_err(new_zone_id);
    // if (new_zone_res.is_err()) return err(new_zone_res.error);
    // let new_zone = new_zone_res.unwrap();
    let new_zone = zone_repo.get_or_throw(new_zone_id);

    // let entity_res = entity_repo.get_or_err(entity_id);
    // if (entity_res.is_err()) return err(entity_res.error);
    // let entity = entity_res.unwrap();
    let entity = entity_repo.get_or_throw(entity_id);

    // remove entity from previous zone
    if (entity.zone_id.is_some()) {
        // let previous_zone_res = zone_repo.get_or_err(entity.zone_id.value);
        // if (previous_zone_res.is_err()) return err(previous_zone_res.error);
        // let previous_zone = previous_zone_res.unwrap();
        let previous_zone = zone_repo.get_or_throw(entity.zone_id.value);

        // to avoid error if the entity is not in the zone of his zone_id
        if (previous_zone.contains_entity(entity_id)) {
            let res = remove_entity_from_zone(entity_id, entity.zone_id.value, zone_repo, entity_repo);
            if (res.is_err()) return res;
        }
    }

    new_zone.add_entity(entity_id);
    entity.zone_id = some(new_zone_id);
    return ok(undefined);
}

export function connect_zones(zone_a_id: ZoneId, zone_b_id: ZoneId, zone_repo: ZoneRepository): Result<void, string> {
    // let zone_a_res = zone_repo.get_or_err(zone_a_id);
    // if (zone_a_res.is_err()) return err(zone_a_res.error);
    // let zone_a = zone_a_res.unwrap();
    let zone_a = zone_repo.get_or_throw(zone_a_id);

    // let zone_b_res = zone_repo.get_or_err(zone_b_id);
    // if (zone_b_res.is_err()) return err(zone_b_res.error);
    // let zone_b = zone_b_res.unwrap();
    let zone_b = zone_repo.get_or_throw(zone_b_id);

    zone_a.add_connected_zone(zone_b_id);
    zone_b.add_connected_zone(zone_a_id);
    return ok(undefined);
}

export function remove_entity_from_zone(entity_id: EntityId, zone_id: ZoneId, zone_repo: ZoneRepository, entity_repo: EntityRepository): Result<void, string> {
    // let entity_res = entity_repo.get_or_err(entity_id);
    // if (entity_res.is_err()) return err(entity_res.error);
    // let entity = entity_res.unwrap();
    let entity = entity_repo.get_or_throw(entity_id);

    // let zone_res = zone_repo.get_or_err(zone_id);
    // if (zone_res.is_err()) return err(zone_res.error);
    // let zone = zone_res.unwrap();
    let zone = zone_repo.get_or_throw(zone_id);

    let res = zone.remove_entity(entity_id);
    if (res.is_err()) return res;

    entity.zone_id = none;
    return ok(undefined);
}
