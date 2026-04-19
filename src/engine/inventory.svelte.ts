// src/engine/inventory.svelte.ts
import type { ItemId, ItemKind, ItemStack } from "./items/item.svelte";
import { none, some, type Opt } from "./utils/option";
import { err, ok, type Result } from "./utils/result";

export class Inventory {
    // items: Record<ItemId, number> = $state({}); voir si on fait version avec ID pour items uniques
    // items: Partial<Record<ItemKind, number>> = $state({});
    items: ItemStack[] = $state([]);

    private find_stack(item_id: ItemId): Opt<ItemStack> {
        const item_stack = this.items.find(stack => stack.item_id === item_id);
        if (item_stack === undefined) {
            return none;
        }
        return some(item_stack);
    }

    add(item_id: ItemId, amount: number) {
        const item_stack_opt = this.find_stack(item_id);
        if (item_stack_opt.is_some()) {
            item_stack_opt.value.amount += amount;
        } else {
            this.items.push({ item_id: item_id, amount: amount });
        }
    }

    remove(item_id: ItemId, amount: number): Result<void, string> {
        if (!this.has_enough(item_id, amount)) return err(`Couldn't remove item ${item_id} from inventory: not enough items`);

        const item_stack_opt = this.find_stack(item_id);
        if (item_stack_opt.is_some()) {
            const item_stack = item_stack_opt.value;
            item_stack.amount -= amount;

            if (item_stack.amount <= 0) {
                this.items = this.items.filter(s => s !== item_stack);
            }
            return ok(undefined);
        }
        return err(`Couldn't remove item ${item_id} from inventory: couldn't find the item`);
    }

    has_enough(item_id: ItemId, amount: number): boolean {
        return this.quantity(item_id) >= amount;
    }

    quantity(item_id: ItemId): number {
        const item_stack_opt = this.find_stack(item_id);
        return item_stack_opt.is_some() ? item_stack_opt.value.amount : 0;
    }
}
