// src/ui/scene.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import type { ZoneId } from "../../engine/map/zone.svelte";

export type SceneKind = Scene['id'];

export type Scene =
    | { id: "hub"; zone_id: ZoneId }
    | { id: "building"; zone_id: ZoneId }
    | { id: "entity_inspect"; entity_id: EntityId; from: Scene }; // "from" pour revenir
