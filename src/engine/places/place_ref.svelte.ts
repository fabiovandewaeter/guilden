// engine/places/place_ref.svelte.ts

import type { HubId } from "./hub.svelte";
import type { RoomId } from "./room.svelte";

export type PlaceRef =
    | { tag: "hub", id: HubId }
    | { tag: "room", id: RoomId }
