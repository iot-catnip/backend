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

    static afterInsert({ inputItems }: any) {
        subController.index('utilisateur', inputItems[0], 'insert')
      }

    static afterUpdate({inputItems}: any){
    subController.index('utilisateur', inputItems[0], 'update')
    }

    static afterDelete(){
    subController.index('utilisateur', {}, 'delete')
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