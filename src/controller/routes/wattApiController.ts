import controller from "../../app/controller";
import {watt} from "../../models/watt.model";
import {temperature} from "../../models/temperature.model";
import dataMerger from "../../extensions/utils/dataMerger";

export default class wattApiController extends controller {
    async index() {
        let data;
        if (this.request.url.split('/')[3] === 'avg') {
            data = await watt.query().select().avg('valeur');
            // @ts-ignore
            this.response.json({avg:data[0][Object.keys(data[0])[0]]});
            return;
        }else if (this.params.interval){
            switch (this.params.interval){
                case 'last':
                    data = await watt.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').orderBy('date_mesure','desc').limit(1);
                    this.response.json({
                        watt: data
                    });
                    break;
                case '20m':
                    data = await watt.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-1200000);
                    this.response.json({
                        watt: data
                    });
                    break;
                case '1h':
                    data = await watt.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-3600000);
                    this.response.json({
                        watt: data
                    });
                    break;
                case '5h':
                    data = await watt.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-18000000);
                    this.response.json({
                        watt: dataMerger(data,300000)
                    });
                    break;

                case '1j':
                    data = await watt.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-86400000);
                    this.response.json({
                        watt: dataMerger(data,1800000)
                    });
                    break;
                case '1w':
                    data = await watt.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-604800000);
                    this.response.json({
                        watt: dataMerger(data,5400000)
                    });
                    break;
                case '1m':
                    data = await watt.query().select('valeur', 'date_mesure', 'prise_id').joinRelated('prise').where('date_mesure','>=',Date.now().valueOf()-2592000000);
                    this.response.json({
                        watt: dataMerger(data,1800000)
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
