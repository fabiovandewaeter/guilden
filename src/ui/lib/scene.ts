// src/ui/scene.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import type { BuildingId } from "../../engine/places/building.svelte";
import type { HubId } from "../../engine/places/hub.svelte";
import type { RoomId } from "../../engine/places/room.svelte";

export type SceneKind = Scene['id'];

export type Scene =
    | { id: "hub", hub_id: HubId }
    | { id: "building", building_id: BuildingId }
    | { id: "room", room_id: RoomId }
    | { id: "entity_inspect", entity_id: EntityId }
    | { id: "ERROR", message?: string };
