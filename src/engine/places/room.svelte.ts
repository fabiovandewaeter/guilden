// engine/places/room.svelte.ts

import type { EntityId } from "../entities/entity.svelte";
import type { InstancedItemRepository } from "../items/instanced_item_repository.svelte";
import { Opt, none } from "../utils/option";
import { err, ok, type Result } from "../utils/result";
import type { ProductionComponent } from "./production_component.svelte";

export type RoomId = number & { readonly __type: unique symbol };

export class Room {
    readonly id: RoomId;
    name: string = $state()!;
    entities: EntityId[] = $state([]);
    connected_rooms: RoomId[] = $state([]);
    // furtniture: Furniture[] = $state([]);
    production: Opt<ProductionComponent> = $state(none);

    constructor(id: RoomId, name: string) {
        this.id = id;
        this.name = name;
    }

    tick(delta_ms: number, instanced_item_repo: InstancedItemRepository) {
        if (this.production.is_some()) {
            this.production.value.tick(delta_ms, instanced_item_repo);
        }
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
            return err(`${entity_id} not found in room ${this.id}`);
        }
        return ok(undefined);
    }

    add_connected_room(connected_room_id: RoomId): Result<void, string> {
        if (this.connected_rooms.includes(connected_room_id)) return err(`${connected_room_id} already is a connected_room of room ${this.id}`);
        this.connected_rooms.push(connected_room_id);
        return ok(undefined);
    }
    remove_connected_room(connected_room_id: RoomId): Result<void, string> {
        const index = this.connected_rooms.indexOf(connected_room_id);
        if (index !== -1) {
            this.connected_rooms.splice(index, 1);
            return err(`${connected_room_id} not found in room ${this.id}`);
        }
        return ok(undefined);
    }
}
