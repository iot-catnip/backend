import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('temperatures', t => {
        t.increments('id');
        t.float('valeur');
        t.bigInteger('date_mesure');
        t.integer('prise_id');
        t.timestamp('created_at').defaultTo(knex.fn.now());
        t.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('temperatures');
}

