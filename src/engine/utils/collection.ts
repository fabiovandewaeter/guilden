// engine/utils/collection.ts
import { err, ok, type Result } from "../utils/result";

export function list_add<T>(list: T[], item: T, context: string): Result<void, string> {
    if (list.includes(item)) return err(`${item} already in ${context}`);
    list.push(item);
    return ok(undefined);
}

export function list_remove<T>(list: T[], item: T, context: string): Result<void, string> {
    const index = list.indexOf(item);
    if (index === -1) return err(`${item} not found in ${context}`);
    list.splice(index, 1);
    return ok(undefined);
}
