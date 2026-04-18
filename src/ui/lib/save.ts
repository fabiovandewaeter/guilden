// ui/lib/save.ts
import { none, some, type Opt } from "../../engine/utils/option";

export const SAVE_KEY = "last_timestamp";

export function load_timestamp(): Opt<number> {
    const saved = localStorage.getItem(SAVE_KEY);
    return saved ? some(parseInt(saved)) : none;
}

export function save_timestamp(ts: number) {
    localStorage.setItem(SAVE_KEY, ts.toString());
}
