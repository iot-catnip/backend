import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("watts").del();

    // Inserts seed entries
    await knex("watts").insert([
        { id: 1, valeur: 27, date_mesure: Date.now(), prise_id: 1 },
        { id: 2, valeur: 29, date_mesure: Date.now()+10000, prise_id: 1 },
        { id: 3, valeur: 25, date_mesure: Date.now()+20000, prise_id: 1 },
    ]);
};
