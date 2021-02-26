import controller from "../../app/controller";
import DataStoreController from "../../extensions/dataStore/DataStoreController";

export default class isLoggedController extends controller{
    index(){
        const token = this.request.headers.authorization?.replace("Bearer ", "");
        let datastore = DataStoreController.getInstance();
        let loggedArray = datastore.getData("logged");
        if(loggedArray === undefined){
            loggedArray = datastore.addData("logged", []);
        }
        this.response.json(
            {
                logged: loggedArray.includes(token)
            }
        )
    }
}