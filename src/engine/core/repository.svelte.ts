// engine/core/repository.svelte.ts

import { Opt, some, none } from "../utils/option";
import { err, type Result, ok } from "../utils/result";

export class Repository<T, TId extends number, TArgs extends any[] = []> {
    protected _next_id: number = $state(0);
    protected readonly elements: Record<TId, T> = $state({} as Record<TId, T>);

    constructor(private factory: (id: TId, ...args: TArgs) => T) { }

    // Generic spawn method utilizing the factory
    spawn(...args: TArgs): TId {
        const id = this.next_id() as TId;
        this.elements[id] = this.factory(id, ...args);
        return id;
    }

    protected next_id(): number {
        return this._next_id++;
    }

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
