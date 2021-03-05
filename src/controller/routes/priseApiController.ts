import controller from "../../app/controller";
import {prise} from "../../models/prise.model";

export default class priseApiController extends controller{
    async index(){
        let data;
        data = await prise.query().select('id', 'mac', 'nom');

        this.response.json({
            data: data
        });
    }
}