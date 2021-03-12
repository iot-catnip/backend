import { Model } from 'objection';
import knex from '../knex'
import { subController } from '../subController'
import {humidite} from "./humidite.model";
import {temperature} from "./temperature.model";
import {watt} from "./watt.model";

Model.knex(knex)

export class prise extends Model {
    mac!: string;
    nom!: string;

    static relationMappings = {
        humidite: {
            relation: Model.HasManyRelation,
            modelClass: humidite,
            join: {
                from: 'prises.id',
                to: 'humidites.prise_id'
            }
        },
        temperature: {
            relation: Model.HasManyRelation,
            modelClass: temperature,
            join: {
                from: 'prises.id',
                to: 'temperatures.prise_id'
            }
        },
        watt: {
            relation: Model.HasManyRelation,
            modelClass: watt,
            join: {
                from: 'prises.id',
                to: 'watts.prise_id'
            }
        }
    };

    static get tableName() {
        return 'prises';
    }

    static afterInsert({ inputItems }: any) {
        subController.index('prise', inputItems[0], 'insert')
      }

    static afterUpdate({inputItems}: any){
    subController.index('prise', inputItems[0], 'update')
    }

    static afterDelete(){
    subController.index('prise', {}, 'delete')
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['mac', 'nom'],
            
            properties: {
                id: {type: 'integer'},
                mac: {type: 'string', minLength: 1, maxLength: 255},
                nom: {type: 'string', minLength: 1, maxLength: 255}
            }
        }
    }
}
