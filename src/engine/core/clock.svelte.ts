// engine/core/clock.svelte.ts

export class Clock {
    private last_tick_timestamp: number; // timestamp in ms
    private _accumulated_time: number = $state(0);

    constructor(saved_timestamp?: number) {
        this.last_tick_timestamp = saved_timestamp ?? Date.now();
    }

    reset() {
        this.last_tick_timestamp = Date.now();
        this._accumulated_time = 0;
    }

    tick(): number {
        const now = Date.now();
        const delta = now - this.last_tick_timestamp;
        this.last_tick_timestamp = now;
        this._accumulated_time += delta;
        return delta;
    }

    advance_by(ms: number) {
        this._accumulated_time += ms;
    }

    get timestamp(): number {
        return this.last_tick_timestamp;
    }

    get accumulated_time(): number {
        return this._accumulated_time;
    }
}
