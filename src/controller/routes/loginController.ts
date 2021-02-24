import controller from "../../app/controller";
import {randomBytes} from "crypto";
import DataStoreController from "../../extensions/dataStore/DataStoreController";

export default class loginController extends controller{
    index(){
        console.log(this.request.headers.authorization);
        randomBytes(256, (err, buf) => {
            this.response.json(
                {
                    token:  buf.toString("hex")
                }
                );
        });
        //this.response.render('index');
    }
}