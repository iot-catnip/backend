import controller from "../../app/controller";
import {humidite} from "../../models/humidite.model";
import dataMerger from "../../extensions/utils/dataMerger";
import {temperature} from "../../models/temperature.model";

export default class humiditeApiController extends controller{
    async index(){
        let data;
        if (this.request.url.split('/')[3] === 'avg') {
            data = this.params.
                data = await humidite.query().select().avg('valeur');
            // @ts-ignore
            this.response.json({avg:data[0][Object.keys(data[0])[0]]});
        }else if (this.params.interval){
            switch (this.request.url.split('/')[3]){
                case '1h':
                    data = await humidite.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-3600000);
                    this.response.json({
                        data: data
                    });
                    break;
                case '5h':
                    data = await humidite.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-18000000);
                    this.response.json({
                        data: dataMerger(data,600000)
                    });
                    break;

                case '1j':
                    data = await humidite.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-86400000);
                    this.response.json({
                        data: dataMerger(data,1800000)
                    });
                    break;
                case '1w':
                    data = await humidite.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-604800000);
                    this.response.json({
                        data: dataMerger(data,5400000)
                    });
                    break;
                case '1m':
                    data = await humidite.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-2592000000);
                    this.response.json({
                        data: dataMerger(data,1800000)
                    });
                    break;
                default :
                    this.response.json({
                        error:'wrong interval'
                    });
            }
        }
    }
}
