import {Socket, createServer, Server} from "net";
import CatNip from "../frame/CatNip";
import {prise} from "../../../models/prise.model";
import SocketCollection from "./socketCollection";
import CatNipClient from "./CatNipClient";

export default class CatNipServer {
    public static start(){
        var server = createServer();
        console.log("\x1b[32m[Info] > CATNIP Server Running",'\x1b[0m');
        server.on('connection', conn => {
            new CatNipClient(conn);
        });
        server.listen(7788);
    }
}

const catNipServer = new CatNipServer()