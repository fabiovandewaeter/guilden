// engine/places/hub_repository.svelte.ts
import { GenericRepository } from "../generic_repository.svelte";
import { type HubId, Hub } from "./hub.svelte";

export class HubRepository extends GenericRepository<HubId, Hub> {
    spawn(name: string): HubId {
        const id: HubId = this.next_id() as HubId;
        const hub: Hub = new Hub(id, name);
        this.elements[id] = hub;
        return id;
    }
}
