// engine/entities/profession.ts

export type Profession = {
    name: string,
};

export const PROFESSIONS = {
    blacksmith: {
        name: "Blacksmith",
    },
} satisfies Record<string, Profession>;
