// src/ui/scene.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import type { ZoneId } from "../../engine/zones/zone.svelte";
import type { Opt } from "../../engine/utils/option";

export type SceneKind = Scene['id'];

export type Scene =
    | { id: "hub"; zone_id: ZoneId, from: Opt<Scene> }
    | { id: "building"; zone_id: ZoneId, from: Opt<Scene> }
    | { id: "room"; zone_id: ZoneId, from: Opt<Scene> }
    | { id: "entity_inspect", entity_id: EntityId, from: Opt<Scene> }; // "from" pour revenir
