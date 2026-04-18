// engine/zones/zone_repository.svelte.ts
import { GenericRepository } from "../generic_repository.svelte";
import { Zone, type ZoneId, type ZoneKind } from "./zone.svelte";

export class ZoneRepository extends GenericRepository<ZoneId, Zone> {
    spawn(name: string, kind: ZoneKind): ZoneId {
        const id: ZoneId = this.next_id++;
        const zone: Zone = new Zone(id, name, kind);

        this.elements[id] = zone;
        return id;
    }
}
