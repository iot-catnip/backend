import controllerMiddelware from "../../app/controllerMiddleware";
import DataStoreController from "../../extensions/dataStore/DataStoreController";

export default class authController extends controllerMiddelware{
    index(){
        const token = this.request.headers.authorization?.replace("Bearer ", "");
        let datastore = DataStoreController.getInstance();
        let loggedArray = datastore.getData("logged");
        console.log(token);
        console.log(loggedArray)
        if(loggedArray === undefined){
            loggedArray = datastore.addData("logged", []);
        }
        if(loggedArray.includes(token)) {
            this.next();
        }else{
            this.response.json(
                {
                    logged: loggedArray.includes(token)
                }
            );
        }
    }
}