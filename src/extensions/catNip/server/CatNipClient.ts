import {Socket} from "net";
import CatNip from "../frame/CatNip";

export default class CatNipClient{
    private connexion: Socket;
    private mac: string | undefined;
    constructor(conn: Socket) {
        this.connexion = conn;
        this.connexion.on("data", data => this.data(data));
        this.connexion.on("close", data => this.close(data));
    }

    private data(data: Buffer): void {
        try{
            let catNip = new CatNip();
            catNip.decodeFrame(data);
            if(this.mac == undefined) this.mac = catNip.getClientMacAddress;
            console.log('query from: '+this.mac);
            this.handler(catNip.getPacketType, data);

            this.sendRequest(CatNip.STATUS_RECEIVED);
        }catch (e) {
            console.error(e);
        }
    }

    private close(donnees: Boolean): void {
        console.log("closed");
    }

    private sendPacket(type: number, data: any): void {
        try{
            let catNip = new CatNip();
            catNip.setPacketType = type;
            catNip.setData = data;
            catNip.encodeFrame();
            this.connexion.write(catNip.getFrame);
        }catch (e) {
            console.error(e);
        }
    }

    private sendRequest(type: number): void {
        try{
            let catNip = new CatNip();
            catNip.setPacketType = type;
            catNip.encodeFrame();
            this.connexion.write(catNip.getFrame);
        }catch (e) {
            console.error(e);
        }
    }

    private handler(type: number | null, data: any){
        switch (type){
            case CatNip.DATA_CONSUMATION:
                this.data_consumation(data);
                break;
            case CatNip.DATA_HUMIDITY:
                this.data_humidity(data);
                break;
            case CatNip.DATA_TEMPERATURE:
                this.data_temperature(data);
                break;
            case CatNip.DATA_ON:
                this.data_on(data);
                break;
            case CatNip.STATUS_ALIVE:
                this.data_alive(data);
                break;
        }
    }

    private data_consumation(data: any) {

    }

    private data_humidity(data: any) {

    }

    private data_temperature(data: any) {

    }

    private data_on(data: any) {

    }

    private data_alive(data: any) {

    }

}