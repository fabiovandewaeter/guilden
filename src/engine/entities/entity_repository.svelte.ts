// engine/entities/entity_repository.svelte.ts
import type { PlaceRef } from "../places/place.svelte";
import { type EntityId, type Stats, Entity } from "./entity.svelte";
import { GenericRepository } from "../generic_repository.svelte";
import { some } from "../utils/option";

export class EntityRepository extends GenericRepository<EntityId, Entity> {
    spawn(name: string, place: PlaceRef, max_stats: Stats): EntityId {
        const id: EntityId = this.next_id++;
        const entity: Entity = new Entity(id, name, some(place), max_stats);

        this.elements[id] = entity;
        return id;
    }
}
