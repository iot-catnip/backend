import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("temperatures").del();

    // Inserts seed entries
    await knex("temperatures").insert([
        { id: 1, valeur: 27.32, date_mesure: Date.now(), prise_id: 1 },
        { id: 2, valeur: 29.10, date_mesure: Date.now()+10000, prise_id: 1 },
        { id: 3, valeur: 25.7, date_mesure: Date.now()+20000, prise_id: 1 },
    ]);
};