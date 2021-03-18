import {Socket, createServer, Server} from "net";
import CatNip from "../frame/CatNip";
import {prise} from "../../../models/prise.model";
import SocketCollection from "./socketCollection";

export default class HandshakeServer {
    //private socketCollection : Array<SocketCollection>;

    public static start(){
        createServer(socket => {
            this.connexionListener(socket)
            console.log("\x1b[32m[Info] > CATNIP Handshak Server Running",'\x1b[0m');
        }).listen(7788);
    }

    private static connexionListener(socket: Socket){
        socket.on("data", async (chunk: Buffer) =>{
            let cat = new CatNip();
            cat.decodeFrame(chunk);
            if (cat.getPacketType==CatNip.STATUS_HELLO){
                const currentPlug = await prise.query().select('mac').where('mac', '=', cat.getClientMacAddress).execute()
                if (currentPlug.length==0){
                    await prise.query().insert({
                        mac:cat.getClientMacAddress,
                        nom:cat.getClientMacAddress
                    }).execute();
                }
                //this.createNewServer(socket);
            }
        });
    }

    private createNewServer(socket: Socket) {
        socket.emit("data");
    }
}

const handshakeServer = new HandshakeServer()