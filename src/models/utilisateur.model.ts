import { Model } from 'objection';
import knex from '../knex'
import { subController } from '../subController'

Model.knex(knex)

export class utilisateur extends Model {
    username!: string;
    email!: string;
    password!: string;

    static get tableName() {
        return 'utilisateurs';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'password'],
            
            properties: {
                id: {type: 'integer'},
                username: {type: 'string', minLength: 1, maxLength: 255},
                email: {type: 'string', minLength: 1, maxLength: 255},
                password: {type: 'string', minLength: 1, maxLength: 1024}
            }
        }
    }
}