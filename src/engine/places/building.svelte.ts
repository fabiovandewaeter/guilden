// engine/places/building.svelte.ts
import { list_add, list_remove } from "../utils/collection";
import { err, ok, type Result } from "../utils/result";
import type { RoomId } from "./room.svelte";

export type BuildingId = number & { readonly __type: unique symbol };

export class Building {
    readonly id: BuildingId;
    name: string = $state()!;
    rooms: RoomId[] = $state([]);

    constructor(id: BuildingId, name: string) {
        this.id = id;
        this.name = name;
    }

    add_room(room_id: RoomId): Result<void, string> { return list_add(this.rooms, room_id, `building ${this.id} rooms`); }
    remove_room(room_id: RoomId): Result<void, string> { return list_remove(this.rooms, room_id, `building ${this.id} rooms`); }

    // abstract tick(delta_ms: number): void; production moved to Room
}
