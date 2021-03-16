import { prise } from "../../../models/prise.model";

export default interface SocketCollection {
    serverPort : number;
    prise : prise;
}