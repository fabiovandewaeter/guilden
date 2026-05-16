// engine/entities/species.ts

export type Species = {
    name: string,
    //default_traits: Traits[]
};

export const SPECIES = {
    human: {
        name: "Human",
        //default_traits:[]
    }
} satisfies Record<string, Species>;
