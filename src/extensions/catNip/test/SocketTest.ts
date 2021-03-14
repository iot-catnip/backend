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
            console.log(cat.getData);
        }catch (e){
            console.log(e);
        }
    });

    setInterval(function (){
        let cat = new CatNip();
        cat.setPacketType = CatNip.ASK_TEMPERATURE;
        cat.encodeFrame();
        socket.write(cat.getFrame);
        console.log(cat.getFrame);
        console.log('datasend')
    },5000);
}).listen(6000);

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