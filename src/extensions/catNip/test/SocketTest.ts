import {Socket,createServer} from "net";
import CatNip from "../frame/CatNip";

//server
createServer(async function (socket:Socket) {
    console.log("connected");

    socket.on('data', function (chunk:Buffer) {

        let cat = new CatNip();
        console.log(chunk)
        try {
            cat.decodeFrame(chunk);
            console.log(cat.getFrameType);
            console.log(cat.getClientMacAddress);
            let catresp = new CatNip();
            catresp.setPacketType = CatNip.DATA_PORT;
            catresp.setData = 25001;
            catresp.encodeFrame();
            console.log(catresp.getFrame)
            socket.write(catresp.getFrame)
        }catch (e){
            console.log(e);
        }
    });
}).listen(7788);

createServer(async function (socket:Socket) {
    console.log("connected client");
    socket.on('data', function (chunk:Buffer) {
        console.log(chunk)
    })
}).listen(25001);
/*
// client
let s = new Socket();
s.connect(8888);
// Create tram
let a = [CatNip.START_FRAME,CatNip.PACKET_HELLO_LENGTH,CatNip.STATUS_HELLO,0x70,0x4B,0x7B,0x2A,0x03,0xA4]
a.push(CatNip.calculateCheckSum(a))
let b = new Uint8Array(a);

//send tram


s.write(b);
s.end();

*/