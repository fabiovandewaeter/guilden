// engine/clock.ts

export class Clock {
    private last_tick_timestamp: number; // timestamp in ms

    constructor(saved_timestamp?: number) {
        this.last_tick_timestamp = saved_timestamp ?? Date.now();
    }

    tick(): number {
        const now = Date.now();
        const delta = now - this.last_tick_timestamp;
        this.last_tick_timestamp = now;
        return delta;
    }

    get timestamp(): number {
        return this.last_tick_timestamp;
    }
}
