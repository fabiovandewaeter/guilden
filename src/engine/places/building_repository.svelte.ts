// engine/places/building_repository.svelte.ts
import { GenericRepository } from "../generic_repository.svelte";
import { type BuildingId, Building } from "./building.svelte";

export class BuildingRepository extends GenericRepository<BuildingId, Building> {
    spawn(name: string): BuildingId {
        const id: BuildingId = this.next_id() as BuildingId;
        const building: Building = new Building(id, name);
        this.elements[id] = building;
        return id;
    }
}
