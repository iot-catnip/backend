import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("prises").del();

    // Inserts seed entries
    await knex("prises").insert([
        { id: 1, mac: "macadress", nom: "Prise n°1" },
    ]);
};
