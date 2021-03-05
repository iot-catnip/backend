import { Model } from 'objection';
import knex from '../knex'
import { subController } from '../subController'

Model.knex(knex)

export class temperature extends Model {
    valeur!: number;
    date_mesure!: number;
    prise_id!: number;

    static get tableName() {
        return 'temperatures';
    }

    static relationMappings = {
        prise: {
            relation: Model.HasOneRelation,
            modelClass:  __dirname + '/prise.model',
            join: {
                from: 'temperatures.prise_id',
                to: 'prises.id'
            }
        }
    }

    static afterInsert({ inputItems }: any) {
        subController.index('temperature', inputItems[0], 'insert')
      }

    static afterUpdate({inputItems}: any){
    subController.index('temperature', inputItems[0], 'update')
    }

    static afterDelete(){
    subController.index('temperature', {}, 'delete')
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['valeur', 'date_mesure', 'prise_id'],

            properties: {
                id: {type: 'integer'},
                valeur: {type: 'float'},
                date_mesure: {type: 'integer'},
                prise_id: {type: 'integer'}
            }
        }
    }
}