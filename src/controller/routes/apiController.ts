import controller from "../../app/controller";
import {randomBytes} from "crypto";
import DataStoreController from "../../extensions/dataStore/DataStoreController";

export default class apiController extends controller{
    index(){
        let datastore = DataStoreController.getInstance();
        randomBytes(256, (err, buf) => {
            datastore.addData("key", []).push(buf.toString("hex"))
        });
        this.session.data
        console.log();
        this.response.json(datastore.getAllData());
    }
}