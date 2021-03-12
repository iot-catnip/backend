import controller from "../../app/controller";
import {prise} from "../../models/prise.model";

export default class priseApiController extends controller{
    async index(){
        if(this.request.method === "GET"){
            let data;
            data = await prise.query().select('id', 'mac', 'nom');

            this.response.json({
                data: data
            });
        }
        else if(this.request.method == "POST"){
            let {name, id} = this.request.body;
            try{
                let query = await prise.query().findById(id).patch({
                    nom: name
                });
                this.response.json({
                    success: true,
                    updated: query
                })
            } catch (e) {
                this.response.json({
                    success: false,
                    error: e
                })
            }

        }

    }
}
