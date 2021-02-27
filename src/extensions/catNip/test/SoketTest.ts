import {Socket,createServer} from "net";
import CatNip from "../CatNip";
/*
//server
createServer(function (socket:Socket) {
    console.log("connected");

    //When recive data
    socket.on('data', function (chunk:Buffer) {
        catnip = new CatNip()
        catnip.decodeFrame(chunk)
        console.log(catnip.getFrameType)
    });
}).listen(8080);

// client
let s = new Socket();
s.connect(8080);
// Create tram
let catnip = new CatNip();
catnip.setPacketType(CatNip.ASK_TEMPERATURE);
catnip.encodeFrame();
//send tram
s.write(catnip.getFrame());
s.end();
*/
const test = 0x12, test1 = 0x10
const add = (a:number, b:number) => (a << Math.ceil(Math.log2(b)) + 1) + b;
const arr = new Uint8Array([0b00110101,0b00000111])
//console.log(parseInt(test.toString(2) + test1.toString(2), 2))
console.log(CatNip.concatenateBytes(arr))