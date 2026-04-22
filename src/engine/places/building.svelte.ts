// engine/places/building.svelte.ts
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

    add_room(room_id: RoomId): Result<void, string> {
        if (this.rooms.includes(room_id)) return err(`${room_id} already is a rooms of place ${this.id}`);
        this.rooms.push(room_id);
        return ok(undefined);
    }
    remove_room(room_id: RoomId): Result<void, string> {
        const index = this.rooms.indexOf(room_id);
        if (index !== -1) {
            this.rooms.splice(index, 1);
            return err(`${room_id} not found in place ${this.id}`);
        }
        return ok(undefined);
    }

    // abstract tick(delta_ms: number): void; production moved to Room
}
