// engine/places/room_repository.svelte.ts
import { GenericRepository } from "../generic_repository.svelte";
import { type RoomId, Room } from "./room.svelte";

export class RoomRepository extends GenericRepository<RoomId, Room> {
    spawn(name: string): RoomId {
        const id: RoomId = this.next_id() as RoomId;
        const room: Room = new Room(id, name);
        this.elements[id] = room;
        return id;
    }
}
