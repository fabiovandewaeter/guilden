// engine/entities/entity_archetype.ts

export type EntityArchetype = {
    name: string,
};

export const ENTITY_ARCHETYPES = {
    tank: {
        name: "Tank",
    },
} satisfies Record<string, EntityArchetype>;
