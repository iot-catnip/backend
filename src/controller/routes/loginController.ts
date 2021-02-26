import controller from "../../app/controller";
import {createHash, randomBytes} from "crypto";
import {utilisateur} from "../../models/utilisateur.model";
import DataStoreController from "../../extensions/dataStore/DataStoreController";
import TimedRemover from "../../extensions/timedRemover/TimedRemover";

export default class loginController extends controller{
    async index(){
        const {username, password, remember} = this.request.body;
        if(password != undefined && username != undefined) {
            const passwordHash = createHash('sha256').update(password).digest('base64');
            const users: any = await utilisateur.query()
                .select("username")
                .where("username", "=", username)
                .where("password", "=", passwordHash);
            if(users[0] !== undefined)
            {
                randomBytes(20, (err, buf) => {
                    let buffer = buf.toString("hex");
                    let datastore = DataStoreController.getInstance();
                    let loggedArray = datastore.addData("logged", []);
                    loggedArray.push(buffer);
                    this.response.json(
                        {
                            success: true,
                            token: buffer,
                            loggedArray: loggedArray
                        }
                    );
                    this.removeAt(buffer, "logged", 3600);
                });
            }else{
                this.response.json(
                    {
                        success: false
                    }
                );
            }
        } else {
            this.response.json(
                {
                    success: false
                }
            );
        }
    }

    private removeAt(data: string, dataName: string, time: number){
        time = time*1000
        let datastore = DataStoreController.getInstance();
        setTimeout(()=>{
            try{
                let arr = datastore.getData(dataName).filter((item: any) => item !== data)
                datastore.setData(dataName, arr)
            }catch (e) {

            }
        }, time)
    }
}