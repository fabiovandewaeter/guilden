// src/ui/scene.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import type { PlaceId } from "../../engine/places/place.svelte";
import type { Opt } from "../../engine/utils/option";

export type SceneKind = Scene['id'];

export type Scene =
    | { id: "hub"; place_id: PlaceId, from: Opt<Scene> }
    | { id: "building"; place_id: PlaceId, from: Opt<Scene> }
    | { id: "room"; place_id: PlaceId, from: Opt<Scene> }
    | { id: "entity_inspect", entity_id: EntityId, from: Opt<Scene> }; // "from" pour revenir
