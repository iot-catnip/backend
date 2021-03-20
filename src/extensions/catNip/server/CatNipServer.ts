import {Socket, createServer, Server} from "net";
import CatNip from "../frame/CatNip";
import {prise} from "../../../models/prise.model";
import SocketCollection from "./socketCollection";
import CatNipClient from "./CatNipClient";

export default class CatNipServer {
    private static catNipClients: Array<CatNipClient> = [];
    public static scheduleDelay: number;
    public static activateScheduling: boolean;

    public static start() {
        var server = createServer();
        console.log("\x1b[32m[Info] > CATNIP Server Running", '\x1b[0m');
        server.on('connection', conn => {
            CatNipServer.catNipClients.push(new CatNipClient(conn));
        });
        server.listen(7788);
        CatNipServer.activateScheduling = true
        CatNipServer.scheduleDelay = 50000;
        CatNipServer.schedule();
    }

    private static schedule() {
        if (CatNipServer.activateScheduling) {
            CatNipServer.catNipClients.forEach(value => {
                if (value instanceof CatNipClient) {

                    console.log("Ask Temperature")
                    value.sendRequest(CatNip.ASK_TEMPERATURE);

                    setTimeout(() => {

                        console.log("Ask Humidity")
                        value.sendRequest(CatNip.ASK_HUMIDITY);

                        setTimeout(() => {

                            console.log("Ask watt")
                            value.sendRequest(CatNip.ASK_WATT);

                        }, CatNipServer.scheduleDelay / 3);
                    }, CatNipServer.scheduleDelay / 3);
                }
            })
            setTimeout(() => {
                CatNipServer.schedule()
            }, CatNipServer.scheduleDelay)
        }
    }

    static removeConn(id : number) {
        for (let i = 0; i < CatNipServer.catNipClients.length; i++) {
            if (CatNipServer.catNipClients[i].plugId===id){
                CatNipServer.catNipClients.splice(i,1);
            }
        }
    }
}

const catNipServer = new CatNipServer()