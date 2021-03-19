import {Socket} from "net";
import CatNip from "../frame/CatNip";

export default class CatNipClient{
    private connexion: Socket;
    constructor(conn: Socket) {
        this.connexion = conn;
        this.connexion.on("data", data => this.data(data));
        this.connexion.on("close", data => this.close(data));
    }

    private data(donnees: Buffer): void {
        console.log(donnees);
    }

    private close(donnees: Boolean): void {
        console.log("closed")
    }

    private sendPacket(type: number, data: any) {
        let catNip = new CatNip();
        catNip.setPacketType = type;
        catNip.setData = data;
        catNip.encodeFrame();
        this.connexion.write(catNip.getFrame);
    }

    private sendRequest(type: number) {
        let catNip = new CatNip();
        catNip.setPacketType = type;
        catNip.encodeFrame();
        this.connexion.write(catNip.getFrame);
    }
}