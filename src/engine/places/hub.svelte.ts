// engine/places/hub.svelte.ts
import type { Repository } from "../core/repository.svelte";
import type { EntityId } from "../entities/entity.svelte";
import { list_add, list_remove } from "../utils/collection";
import { type Result } from "../utils/result";
import type { BuildingId } from "./building.svelte";

export type HubId = number & { readonly __type: unique symbol };
export type HubRepositoy = Repository<Hub, HubId, [string]>;

// hub, plain, road ...
export class Hub {
    readonly id: HubId;
    name: string = $state()!;
    entities: EntityId[] = $state([]);
    buildings: BuildingId[] = $state([]);
    connected_hubs: HubId[] = $state([]);

    constructor(id: HubId, name: string) {
        this.id = id;
        this.name = name;
    }

    contains_entity(entity_id: EntityId): boolean {
        const index = this.entities.indexOf(entity_id);
        return index !== -1;
    }
    add_entity(entity_id: EntityId) { return list_add(this.entities, entity_id, `hub ${this.id} entities`) }
    remove_entity(entity_id: EntityId): Result<void, string> { return list_remove(this.entities, entity_id, `hub ${this.id} entities`); }

    add_building(building_id: BuildingId): Result<void, string> { return list_add(this.buildings, building_id, `hub ${this.id} buildings`) }
    remove_building(building_id: BuildingId): Result<void, string> { return list_remove(this.buildings, building_id, `hub ${this.id} buildings`) }

    add_connected_hub(connected_hub_id: HubId): Result<void, string> { return list_add(this.connected_hubs, connected_hub_id, `hub ${this.id} connected_hubs`) }
    remove_connected_hub(connected_hub_id: HubId): Result<void, string> { return list_remove(this.connected_hubs, connected_hub_id, `hub ${this.id} connected_hubs`) }
}
