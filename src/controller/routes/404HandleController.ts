import controller from "../../app/controller";
import path from "path";

export default class handle404Controller extends controller{
    async index(){
        this.response.sendFile(path.join(__dirname, '/../../public/index.html'))
    }
}