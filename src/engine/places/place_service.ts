// engine/places/place.ts
import type { EntityId } from "../entities/entity.svelte";
import type { EntityRepository } from "../entities/entity_repository.svelte";
import { some } from "../utils/option";
import type { World } from "../world.svelte";
import type { BuildingId } from "./building.svelte";
import type { BuildingRepository } from "./building_repository.svelte";
import type { Hub, HubId } from "./hub.svelte";
import type { PlaceRef } from "./place_ref.svelte";
import { ProductionComponent } from "./production_component.svelte";
import type { Room, RoomId } from "./room.svelte";
import type { RoomRepository } from "./room_repository.svelte";

/** return the Room or Hub corresponding to the place_ref */
function resolve(place_ref: PlaceRef, world: World): Room | Hub {
    if (place_ref.tag === 'room') return world.room_repo.get(place_ref.id).expect(`Room ${place_ref.id} not found`);
    return world.hub_repo.get(place_ref.id).expect(`Hub ${place_ref.id} not found`);
}

export function move_entity(
    entity_id: EntityId,
    dest: PlaceRef,
    world: World,
    entity_repo: EntityRepository
): void {
    const entity = entity_repo.get(entity_id).expect(`Entity ${entity_id} not found`);

    if (entity.place.is_some()) {
        resolve(entity.place.value, world).remove_entity(entity_id).assert_ok();
    }

    resolve(dest, world).add_entity(entity_id);

    entity.place = some(dest);
}

export function connect_rooms(a_id: RoomId, b_id: RoomId, world: World): void {
    const a = world.room_repo.get(a_id).expect(`Room ${a_id} not found`);
    const b = world.room_repo.get(b_id).expect(`Room ${b_id} not found`);
    a.add_connected_room(b_id).assert_ok();
    b.add_connected_room(a_id).assert_ok();
}

export function connect_hubs(a_id: HubId, b_id: HubId, world: World): void {
    const a = world.hub_repo.get(a_id).expect(`Hub ${a_id} not found`);
    const b = world.hub_repo.get(b_id).expect(`Hub ${b_id} not found`);
    a.add_connected_hub(b_id).assert_ok();
    b.add_connected_hub(a_id).assert_ok();
}

// === spawners ===================================================================
export function spawn_forge(name: string, building_repo: BuildingRepository, room_repo: RoomRepository): { building_id: BuildingId, room_id: RoomId } {
    const building_id = building_repo.spawn(name);
    const room_id = room_repo.spawn(`${name} - production room`);

    const building = building_repo.get(building_id).unwrap();
    const room = room_repo.get(room_id).unwrap();

    building.add_room(room_id).assert_ok();
    room.production = some(new ProductionComponent());

    return { building_id, room_id };
}
