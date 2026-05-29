// engine/places/room.svelte.ts

import type { EntityId } from "../entities/entity.svelte";
import type { Repository } from "../core/repository.svelte";
import { list_add, list_remove } from "../utils/collection";
import { Opt, none } from "../utils/option";
import { type Result } from "../utils/result";
import type { ProductionComponent } from "../production/production_component.svelte";

export type RoomId = number & { readonly __type: unique symbol };
export type RoomRepository = Repository<Room, RoomId, [string]>;

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

    contains_entity(entity_id: EntityId): boolean {
        const index = this.entities.indexOf(entity_id);
        return index != -1;
    }
    add_entity(entity_id: EntityId) { return list_add(this.entities, entity_id, `room ${this.id} entities`); }
    remove_entity(entity_id: EntityId): Result<void, string> { return list_remove(this.entities, entity_id, `room ${this.id} entities`); }

    add_connected_room(connected_room_id: RoomId): Result<void, string> { return list_add(this.connected_rooms, connected_room_id, `room ${this.id} connected_rooms`); }
    remove_connected_room(connected_room_id: RoomId): Result<void, string> { return list_remove(this.connected_rooms, connected_room_id, `room ${this.id} connected_rooms`); }
}
