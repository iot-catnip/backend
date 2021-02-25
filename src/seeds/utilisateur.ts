import * as Knex from "knex";
import {createHash} from "crypto";
export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("utilisateurs").del();

    // Inserts seed entries
    await knex("utilisateurs").insert([
        { username: "admin", email: "admin@test.fr", password: createHash('sha256').update("admin").digest('base64') }
    ]);
};