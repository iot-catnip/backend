import {Socket, createServer, Server} from "net";
import CatNip from "../frame/CatNip";
import {prise} from "../../../models/prise.model";
import SocketCollection from "./socketCollection";

export default class handshakeServer{
    private server : Server;
    private socketCollection : Array<SocketCollection>;

    constructor(port:number) {
        this.server = createServer().listen(port)
        this.server.addListener("connection",this.connexionListener);
    }

    private connexionListener(socket: Socket){
        socket.on("data", (chunk: Buffer) =>{
            let cat = new CatNip();
            cat.decodeFrame(chunk);
            if (cat.getPacketType==CatNip.STATUS_HELLO){
                if (prise.query().select('mac').where('mac', '=', cat.getClientMacAddress)!=null){
                }
                this.createNewServer(socket);
            }
        });
    }

    private createNewServer(socket: Socket) {
        socket.emit("data");
    }
}