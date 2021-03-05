import { Model } from 'objection';
import knex from '../knex'
import { subController } from '../subController'

Model.knex(knex)

export class humidite extends Model {
    valeur!: number;
    date_mesure!: number;
    prise_id!: number;

    static get tableName() {
        return 'humidites';
    }

    static relationMappings = {
        prise: {
            relation: Model.HasOneRelation,
            modelClass: __dirname + '/prise.model',
            join: {
                from: 'humidites.prise_id',
                to: 'prises.id'
            }
        }
    }

    static afterInsert({ inputItems }: any) {
        subController.index('humidites', inputItems[0], 'insert')
      }

    static afterUpdate({inputItems}: any){
    subController.index('humidites', inputItems[0], 'update')
    }

    static afterDelete(){
    subController.index('humidites', {}, 'delete')
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['valeur', 'date_mesure', 'prise_id'],
            
            properties: {
                id: {type: 'integer'},
                valeur: {type: 'integer'},
                date_mesure: {type: 'integer'},
                prise_id: {type: 'integer'}
            }
        }
    }
}