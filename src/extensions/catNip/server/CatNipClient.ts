import {Socket} from "net";
import CatNip from "../frame/CatNip";
import {watt} from "../../../models/watt.model";
import {prise} from "../../../models/prise.model";
import {humidite} from "../../../models/humidite.model";
import {temperature} from "../../../models/temperature.model";
import CatNipServer from "./CatNipServer";

export default class CatNipClient{
    private connexion: Socket;
    private mac: string | undefined;
    private id: number | undefined;
    constructor(conn: Socket) {
        this.connexion = conn;
        this.connexion.on("data", data => this.data(data));
        this.connexion.on("close", data => this.close(data));
    }

    private async data(data: Buffer): Promise<void> {
        try {
            let catNip = new CatNip();
            catNip.decodeFrame(data);
            if (this.mac == undefined) {
                this.mac = catNip.getClientMacAddress;
                this.id = await this.getPlugIdFromMac(this.mac);
            }
            console.log(`[Info] > receive CatNipFarm type ${catNip.getPacketType?.toString(16)} from ${this.mac}`);
            this.handler(catNip);
            this.sendRequest(CatNip.STATUS_RECEIVED);
        } catch (e) {
            console.error(e);
        }
    }

    private close(donnees: Boolean): void {
        if (this.id)
            CatNipServer.removeConn(this.id)
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

    public sendRequest(type: number): void {
        try{
            let catNip = new CatNip();
            catNip.setPacketType = type;
            catNip.encodeFrame();
            this.connexion.write(catNip.getFrame);
        }catch (e) {
            console.error(e);
        }
    }

    private handler(catData: CatNip){
        switch (catData?.getPacketType){
            case CatNip.DATA_CONSUMATION:
                this.data_consumation(catData.getData);
                break;
            case CatNip.DATA_HUMIDITY:
                this.data_humidity(catData.getData);
                break;
            case CatNip.DATA_TEMPERATURE:
                this.data_temperature(catData.getData);
                break;
            case CatNip.DATA_ON:
                //@todo pas implementer sur la carte
                //this.data_on(catData.getData);
                break;
            case CatNip.STATUS_ALIVE:
                //@todo traitement différant ici
                //this.data_alive(data);
                break;
        }
    }

    private data_consumation(data: any) {
        if (this.id != undefined) {
            const obj = {
                prise_id:this.id,
                date_mesure:Date.now(),
                valeur:data
            }
            watt.query().insert(obj).execute()
        }
    }

    private data_humidity(data: any) {
        if (this.id != undefined){
            const obj = {
                prise_id:this.id,
                date_mesure:Date.now(),
                valeur:data
            }
            humidite.query().insert(obj).execute()
        }
    }

    private data_temperature(data: any) {
        if (this.id != undefined){
            const obj = {
                prise_id:this.id,
                date_mesure:Date.now(),
                valeur:data
            }
            temperature.query().insert(obj).execute();
        }
    }

    //@todo : pas implementer sur la carte car pas de relais
    private data_on(data: any) {

    }

    private data_alive(data: any) {

    }

    private async getPlugIdFromMac(mac: string): Promise<number> {
        let plug = await prise.query().select('id').where('mac', '=', mac).limit(1).execute();
        return parseInt(plug[0].$id());
    }

    get plugId():number|undefined{
        return this.id;
    }

}