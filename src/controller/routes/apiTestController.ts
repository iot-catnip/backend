import controller from "../../app/controller";
import {prise} from "../../models/prise.model";
import {temperature} from "../../models/temperature.model";


export default class apiTestController extends controller{
    async index(){
        let data = await temperature.query().select('valeur', 'date_mesure').joinRelated('prise').where('prise_id', '=', 1);

        this.response.json({
            data: data
        });
    }
}