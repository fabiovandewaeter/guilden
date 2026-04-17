// engine/zone_repository.svelte.ts
import { none, some, type Opt } from "../utils/option";
import { err, ok, type Result } from "../utils/result";
import { Zone, type ZoneId, type ZoneKind } from "./zone.svelte";

export class ZoneRepository {
    private next_id: any = $state(0);
    private readonly zones: Record<ZoneId, Zone> = $state({});

    constructor() { }

    get(id: ZoneId): Opt<Zone> {
        const res = this.zones[id];
        return res != null && res != undefined ? some(res) : none;
    }
    get_or_err(id: ZoneId, msg?: string): Result<Zone, string> {
        const zone_opt = this.get(id);
        return zone_opt.is_some() ? ok(zone_opt.value) : err(msg ?? `Zone ${id} does not exist`);
    }
    // TODO: removes this once we want to propagate Result
    get_or_throw(id: ZoneId): Zone {
        return this.get_or_err(id).unwrap();
    }

    spawn(name: string, kind: ZoneKind): ZoneId {
        const id: ZoneId = this.next_id++;
        const zone: Zone = new Zone(id, name, kind);
        this.zones[id] = zone;
        return id;
    }

    delete(id: ZoneId): Result<ZoneId, string> {
        if (delete this.zones[id]) {
            return ok(id);
        }
        return err(`Couldn't delete zone: ${id}`);
    }

    all_ids(): ZoneId[] {
        return Object.keys(this.zones).map(Number) as ZoneId[];
    }
    all(): Zone[] {
        return Object.values(this.zones);
    }
}
