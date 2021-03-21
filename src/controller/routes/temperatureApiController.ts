import controller from "../../app/controller";
import {temperature} from "../../models/temperature.model";
import * as QueryString from "querystring";

export default class temperatureApiController extends controller {
    async index() {
        let data;
        switch (this.request.url.split('/')[3]) {
            case 'avg':
                data = await temperature.query().select().avg('valeur');
                // @ts-ignore
                this.response.json({avg:data[0][Object.keys(data[0])[0]]});
            default:
                let id: any = this.request.query['id'];
                if (!isNaN(id)) {
                    data = await temperature.query().select('valeur', 'date_mesure').joinRelated('prise').where('prise_id', '=', id);
                } else {
                    data = await temperature.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise');
                }

                this.response.json({
                    data: data
                });
        }
    }
}
