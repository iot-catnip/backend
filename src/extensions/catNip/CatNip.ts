export default class CatNip {

    public static START_TRAM = 0x02

    /**
     * All Packet Type Of CAT NIP
     */
    public static STATUS_HELLO = 0x2A
    public static STATUS_ALIVE = 0x2B
    public static STATUS_RECEIVED = 0x2C
    public static ASK_TEMPERATURE = 0x4A
    public static ASK_HUMIDITY = 0x4B
    public static ASK_WATT = 0x4C
    public static ASK_IF_ON = 0x4D
    public static DATA_TEMPERATURE = 0x5A
    public static DATA_HUMIDITY = 0x5B
    public static DATA_CONSUMATION = 0x5C
    public static DATA_ON = 0x5D
    public static ACTION_ON = 0x61
    public static ACTION_OFF = 0x60

    /**
     * Frame Compositor
     */
    public static FRAME_HELLO = 0xFF
    public static FRAME_STATUS = 0xBB
    public static FRAME_DATA = 0xDD

    /**
     * Frame Lenght
     */
    public static FRAME_HELLO_LENGTH = 0x50
    public static FRAME_STATUS_LENGTH = 0x20
    public static FRAME_DATA_LENGTH = 0x30

    /**
     * CatNip Builder Attribute
     */

    private frame: Uint8Array;
    private frameType: number | null;
    private packetLength: number | null;
    private packetType: number | null;
    private data: number | null;
    private clientMacAddress: Uint8Array | null;
    private checksum: number | null;

    constructor() {
        this.frame = new Uint8Array(0);
        this.frameType = null;
        this.packetType = null;
        this.packetLength = null;
        this.data = null;
        this.clientMacAddress = null;
        this.checksum = null;
    }

    public setPacketType(packetType: number) {
        if ([
            CatNip.STATUS_ALIVE,
            CatNip.STATUS_RECEIVED,
            CatNip.ASK_HUMIDITY,
            CatNip.ASK_TEMPERATURE,
            CatNip.ASK_WATT,
            CatNip.ASK_IF_ON,
            CatNip.ACTION_ON,
            CatNip.ACTION_OFF,
            CatNip.STATUS_HELLO,
            CatNip.DATA_CONSUMATION,
            CatNip.DATA_HUMIDITY,
            CatNip.DATA_ON,
            CatNip.DATA_TEMPERATURE,
        ].includes(packetType)) {
            this.packetType = packetType
            return;
        }
        throw "Undefined packetType"
    }


    /**
     * EncodeTrame
     */
    public encodeFrame() {
        if (this.frameType===null||this.packetLength===null){
            this.detectFrameType()
            if (this.frameType===null||this.packetLength===null){
                throw "Unexpected error"
            }
        }

        if (this.packetType===null){
            throw "PacketType can't be null"
        }

        if (this.frameType === CatNip.FRAME_HELLO) {
            throw "Can't Encode Frame HELLO From The Server"
        }

        if (this.frameType === CatNip.FRAME_DATA) {
            throw "Can't Encode Frame DATA From The Server"
        }

        if (this.frameType === CatNip.FRAME_STATUS) {
            let tramBuilder = [CatNip.START_TRAM, this.packetLength,this.packetType]
            tramBuilder.push(CatNip.calculateCheckSum(tramBuilder))
            this.frame = new Uint8Array(tramBuilder)
            return
        }
        throw "No frameType defined"
    }

    public decodeFrame(buffer:Buffer){
        this.frame = new Uint8Array(buffer);
        if (this.frame[0]===CatNip.START_TRAM){
            if (this.frame[1]/8===this.frame.length){
                this.packetLength=this.frame[1]/8
                this.setPacketType(this.frame[2])
                this.detectFrameType();
                switch (this.frameType){
                    case CatNip.FRAME_HELLO:
                        //@todo
                        break;
                    case CatNip.FRAME_DATA:
                        //@todo
                        //CatNip.concatenateBytes()
                        break;
                    case CatNip.FRAME_STATUS:
                        console.log(this.frame[3])
                        console.log(CatNip.calculateCheckSum(this.frame))
                        console.log(this.frame)
                        if (CatNip.calculateCheckSum(this.frame)===this.frame[3]){
                            this.checksum = this.frame[3]
                            return true;
                        }
                        throw "Wrong checksum"
                    default:
                        throw "unknown frame exception"
                }
            }
        }
        throw "Not CatNip frame"
    }


    public detectFrameType() {
        if (this.packetType===null){
            throw "PacketType can't be null"
        }

        if (this.packetType === CatNip.STATUS_HELLO){
            this.frameType = CatNip.FRAME_HELLO;
            this.packetLength = CatNip.FRAME_HELLO_LENGTH;
            return;
        }

        if ([
            CatNip.STATUS_ALIVE,
            CatNip.STATUS_RECEIVED,
            CatNip.ASK_HUMIDITY,
            CatNip.ASK_TEMPERATURE,
            CatNip.ASK_WATT,
            CatNip.ASK_IF_ON,
            CatNip.ACTION_ON,
            CatNip.ACTION_OFF
        ].includes(this.packetType)) {
            this.frameType = CatNip.FRAME_STATUS;
            this.packetLength = CatNip.FRAME_STATUS_LENGTH;
            return ;
        }

        if ([
            CatNip.DATA_CONSUMATION,
            CatNip.DATA_HUMIDITY,
            CatNip.DATA_ON,
            CatNip.DATA_TEMPERATURE,
        ].includes(this.packetType)) {
            this.frameType = CatNip.FRAME_DATA;
            this.packetLength = CatNip.FRAME_DATA_LENGTH;
        }

        throw "No Packet Type Indicate";
    }

    public static calculateCheckSum(bytesArr: Array<number>|Uint8Array) {
        if (bytesArr instanceof Uint8Array){
            bytesArr = bytesArr.subarray(0,bytesArr.length-1) //remove the checksum from frame to recalculate it
        }
        let sum = 0x0;
        for (let i = 0; i < bytesArr.length; i++) {
            sum += bytesArr[i];
        }
        return sum / 16 >> 0;
    }

    public static concatenateBytes(bytesArray: Uint8Array) {
        let returnedValues = new Uint32Array(1);
        let bitNumber=(bytesArray.length*8)-1;
        //console.log(bytesArray.length)
        for (let i = 0; i < bytesArray.length; i++) {
            for (let j=7;j>-1;j--){
                //console.log("bitNum",bitNumber,"i:",i," j:",j," bit:",this.readBit(bytesArray,i,j))
                this.setBit(returnedValues,0,bitNumber,this.readBit(bytesArray,i,j))
                bitNumber--
            }
        }
        return returnedValues
    }

    public static readBit(buffer:any, i:number, bit:number){
        return (buffer[i] >> bit) % 2;
    }

    public static setBit(buffer:any, i:number, bit:number, value:number){
        if(value == 0){
            buffer[i] &= ~(1 << bit);
        }else{
            buffer[i] |= (1 << bit);
        }
    }


    public getFrame(){
        if (this.frame.byteLength!=0)
            return this.frame;
        throw "No frame generated or set"
    }

    get getFrameType(): number | null {
        return this.frameType;
    }

    get getPacketLength(): number | null {
        return this.packetLength;
    }

    get getPacketType(): number | null {
        return this.packetType;
    }

    get getData(): number | null {
        return this.data;
    }

    get getClientMacAddress(): Uint8Array | null {
        return this.clientMacAddress;
    }

    get getChecksum(): number | null {
        return this.checksum;
    }
}