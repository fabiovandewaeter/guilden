// engine/entities/entity_repository.svelte.ts
import type { ZoneId } from "../zones/zone.svelte";
import { type EntityId, type Stats, Entity } from "./entity.svelte";
import { GenericRepository } from "../generic_repository.svelte";
import { some } from "../utils/option";

export class EntityRepository extends GenericRepository<EntityId, Entity> {
    spawn(name: string, zone_id: ZoneId, max_stats: Stats,): EntityId {
        const id: EntityId = this.next_id++;
        const entity: Entity = new Entity(id, name, some(zone_id), max_stats);

        this.elements[id] = entity;
        return id;
    }
}
