// engine/entities/entity_repository.svelte.ts
import { type EntityId, type Stats, Entity } from "./entity.svelte";
import { GenericRepository } from "../generic_repository.svelte";
import { none, some } from "../utils/option";
import type { PlaceRef } from "../places/place_ref.svelte";
import type { Species } from "./species";
import type { Archetype } from "./archetype";
import type { Profession } from "./profession";

export class EntityRepository extends GenericRepository<EntityId, Entity> {
    spawn(name: string, max_stats: Stats, species: Species, archetype: Archetype, profession: Profession): EntityId {
        const id: EntityId = this.next_id() as EntityId;
        const entity: Entity = new Entity(id, name, none, max_stats, species, archetype, profession);

        this.elements[id] = entity;
        return id;
    }
}
