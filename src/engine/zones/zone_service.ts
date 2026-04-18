// engine/zones/zone.ts
import type { EntityId } from "../entities/entity.svelte";
import type { EntityRepository } from "../entities/entity_repository.svelte";
import { none, some } from "../utils/option";
import { ok, type Result } from "../utils/result";
import type { ZoneId } from "./zone.svelte";
import type { ZoneRepository } from "./zone_repository.svelte";

export function move_entity_to_zone(entity_id: EntityId, new_zone_id: ZoneId, zone_repo: ZoneRepository, entity_repo: EntityRepository): void {
    let new_zone = zone_repo.get(new_zone_id).expect(`Cannot move entity to new zone ${new_zone_id}: new zone (${new_zone_id}) does not exist`);
    let entity = entity_repo.get(entity_id).expect(`Cannot move entity to new zone ${new_zone_id}: Entity (${entity_id}) does not exist`);

    // remove entity from previous zone
    if (entity.zone_id.is_some()) {
        let previous_zone = zone_repo.get(entity.zone_id.value).expect(`Cannot move entity to new zone ${new_zone_id}: previous zone (${entity.zone_id.value}) does not exist`);

        if (previous_zone.contains_entity(entity_id)) {
            remove_entity_from_zone(entity_id, entity.zone_id.value, zone_repo, entity_repo);
        }
    }

    new_zone.add_entity(entity_id);
    entity.zone_id = some(new_zone_id);
}

export function connect_zones(zone_a_id: ZoneId, zone_b_id: ZoneId, zone_repo: ZoneRepository): void {
    let zone_a = zone_repo.get(zone_a_id).expect(`Cannot connect: Zone A (${zone_a_id}) does not exist`);
    let zone_b = zone_repo.get(zone_b_id).expect(`Cannot connect: Zone B (${zone_b_id}) does not exist`);

    zone_a.add_connected_zone(zone_b_id);
    zone_b.add_connected_zone(zone_a_id);
}

export function remove_entity_from_zone(entity_id: EntityId, zone_id: ZoneId, zone_repo: ZoneRepository, entity_repo: EntityRepository): void {
    let entity = entity_repo.get(entity_id).expect(`Cannot remove entity from zone ${zone_id}: Entity (${entity_id}) does not exist`);
    let zone = zone_repo.get(zone_id).expect(`Cannot remove entity from zone ${zone_id}: Zone (${zone_id}) does not exist`);

    zone.remove_entity(entity_id).assert_ok();

    entity.zone_id = none;
}
