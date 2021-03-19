import {prise} from "../../../models/prise.model";
import {createServer, Socket} from "net";
import CatNip from "../frame/CatNip";

export default class CatNipServer{
    private port:number;
    private plug:prise;
    private socket: Socket | undefined;

    constructor(plug:prise,port:number) {
        this.plug = plug;
        this.port = port;
    }

    public start(){
        createServer(socket => {
            this.connexionListener(socket)
            this.socket;
        }).listen(this.port)
    }

    private connexionListener(socket:Socket){
        socket.on("data", async (chunk: Buffer) =>{
            let cat = new CatNip();
            cat.decodeFrame(chunk);
        })
    }

    private askForData(){
        //this.socket.write()
    }



}