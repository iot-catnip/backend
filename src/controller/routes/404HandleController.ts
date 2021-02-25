import controller from "../../app/controller";
import {createHash, randomBytes} from "crypto";
import {utilisateur} from "../../models/utilisateur.model";
import DataStoreController from "../../extensions/dataStore/DataStoreController";
import path from "path";

export default class handle404Controller extends controller{
    async index(){
        this.response.sendFile(path.join(__dirname, '/../../public/index.html'))
    }
}