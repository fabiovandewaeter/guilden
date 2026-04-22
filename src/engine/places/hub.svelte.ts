// engine/places/hub.svelte.ts
import type { EntityId } from "../entities/entity.svelte";
import { err, ok, type Result } from "../utils/result";
import type { BuildingId } from "./building.svelte";

export type HubId = number & { readonly __type: unique symbol };

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
        return index != -1;
    }
    add_entity(entity_id: EntityId) {
        if (!this.entities.includes(entity_id)) {
            this.entities.push(entity_id);
        }
    }
    remove_entity(entity_id: EntityId): Result<void, string> {
        const index = this.entities.indexOf(entity_id);
        if (index !== -1) {
            this.entities.splice(index, 1);
            return err(`${entity_id} not found in hub ${this.id}`);
        }
        return ok(undefined);
    }

    add_building(building_id: BuildingId): Result<void, string> {
        if (this.buildings.includes(building_id)) return err(`${building_id} already is a buildings of hub ${this.id}`);
        this.buildings.push(building_id);
        return ok(undefined);
    }
    remove_building(building_id: BuildingId): Result<void, string> {
        const index = this.buildings.indexOf(building_id);
        if (index !== -1) {
            this.buildings.splice(index, 1);
            return err(`${building_id} not found in hub ${this.id}`);
        }
        return ok(undefined);
    }

    add_connected_hub(connected_hub_id: HubId): Result<void, string> {
        if (this.connected_hubs.includes(connected_hub_id)) return err(`${connected_hub_id} already is a connected_hub of hub ${this.id}`);
        this.connected_hubs.push(connected_hub_id);
        return ok(undefined);
    }
    remove_connected_hub(connected_hub_id: HubId): Result<void, string> {
        const index = this.connected_hubs.indexOf(connected_hub_id);

        if (index !== -1) {
            this.connected_hubs.splice(index, 1);
            return err(`${connected_hub_id} not found in hub ${this.id}`);
        }
        return ok(undefined);
    }
}
