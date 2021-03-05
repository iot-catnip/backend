import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("humidites").del();

    // Inserts seed entries
    await knex("humidites").insert([
        { id: 1, valeur: 12, date_mesure: Date.now(), prise_id: 1 },
        { id: 2, valeur: 18, date_mesure: Date.now()+10000, prise_id: 1 },
        { id: 3, valeur: 10, date_mesure: Date.now()+20000, prise_id: 1 },
    ]);
};