// engine/element_repository.svelte.ts
import { Opt, some, none } from "./utils/option";
import { type Result, err, ok } from "./utils/result";

export abstract class GenericRepository<TId extends number, T> {
    protected next_id: any = $state(0);
    protected readonly elements: Record<TId, T> = $state({} as Record<TId, T>);

    constructor() { }

    get(id: TId): Opt<T> {
        const res = this.elements[id];
        return res != null && res !== undefined ? some(res) : none;
    }
    get_or_err(id: TId, msg?: string): Result<T, string> {
        const element_opt = this.get(id);
        return element_opt.is_some() ? ok(element_opt.value) : err(msg ?? `Element ${id} does not exist`);
    }

    delete(id: TId): Result<TId, string> {
        if (delete this.elements[id]) {
            return ok(id);
        }
        return err(`Couldn't delete element: ${id}`);
    }

    all_ids(): TId[] {
        return Object.keys(this.elements).map(Number) as TId[];
    }
    all(): T[] {
        return Object.values(this.elements);
    }
}
