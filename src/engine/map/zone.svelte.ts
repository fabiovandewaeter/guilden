// engine/map/types.svelte.ts
import type { EntityId } from "../entities/entity.svelte";
import { type Result, err, ok } from "../utils/result";

export type ZoneId = number;
export type ZoneKind = "hub" | "building" | "room" | "expedition"

export class Zone {
    readonly id: ZoneId;
    name: string = $state()!;
    kind: ZoneKind = $state()!;
    entities: EntityId[] = $state([]);
    connected_zones: ZoneId[] = $state([]);

    constructor(id: ZoneId, name: string, kind: ZoneKind) {
        this.id = id;
        this.name = name;
        this.kind = kind;
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
        if (index == -1) return err(`Entity ${entity_id} not found in zone ${this.id}`);
        this.entities.splice(index, 1);
        return ok(undefined);
    }

    add_connected_zone(connected_zone_id: ZoneId): Result<void, string> {
        if (this.connected_zones.includes(connected_zone_id)) return err(`${connected_zone_id} already is a connected_zone of zone ${this.id}`);
        this.connected_zones.push(connected_zone_id);
        return ok(undefined);
    }

    remove_connected_zone(connected_zone_id: ZoneId): Result<void, string> {
        const index = this.connected_zones.indexOf(connected_zone_id);

        if (index !== -1) {
            this.connected_zones.splice(index, 1);
            return err(`${connected_zone_id} not found in zone ${this.id}`);
        }
        return ok(undefined);
    }
}
