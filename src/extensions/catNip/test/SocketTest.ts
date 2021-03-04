import {Socket,createServer} from "net";
import CatNip from "../CatNip";

//server
createServer(function (socket:Socket) {
    console.log("connected");

    //When recive data
    socket.on('data', function (chunk:Buffer) {
        let catnip = new CatNip()
        catnip.decodeFrame(chunk)
        console.log("frame type:",catnip.getFrameType)
        console.log("mac:",catnip.getClientMacAddress)
    });
}).listen(8080);

// client
let s = new Socket();
s.connect(8080);
// Create tram
let a = [CatNip.START_FRAME,CatNip.PACKET_HELLO_LENGTH,CatNip.STATUS_HELLO,0x70,0x4B,0x7B,0x2A,0x03,0xA4]
a.push(CatNip.calculateCheckSum(a))
let b = new Uint8Array(a);

//send tram
s.write(b);
s.end();
