// engine/entities/archetype.ts

export type Archetype = {
    name: string,
};

export const ARCHETYPES = {
    tank: {
        name: "Tank",
    },
} satisfies Record<string, Archetype>;
