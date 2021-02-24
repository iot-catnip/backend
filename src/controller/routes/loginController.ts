import controller from "../../app/controller";
import {randomBytes} from "crypto";
import {utilisateur} from "../../models/utilisateur.model";
import DataStoreController from "../../extensions/dataStore/DataStoreController";

export default class loginController extends controller{
    async index(){
        let username = this.request.body.username;
        let password = this.request.body.password;
        let users: any = await utilisateur.query()
            .select("username")
            .where("username", "=", username)
            .where("password", "=", password);
        if(users[0] !== undefined)
        {
            randomBytes(256, (err, buf) => {
                let buffer = buf.toString("hex");
                let datastore = DataStoreController.getInstance();
                let loggedArray = datastore.addData("logged", []);
                loggedArray.push(buffer);
                this.response.json(
                    {
                        success: true,
                        token:  buf.toString("hex"),
                        loggedArray: loggedArray
                    }
                );
            });
        }else{
            this.response.json(
                {
                    success: false
                }
            );
        }
    }
}