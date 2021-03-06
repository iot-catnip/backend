import CatNipError from "./CatNipError";

export default class CatNip {

    public static START_FRAME = 0x02

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
     * Packet Compositor
     */
    public static PACKET_HELLO = 0xFF
    public static PACKET_STATUS = 0xBB
    public static PACKET_DATA = 0xDD

    /**
     * Packet Length
     */
    public static PACKET_HELLO_LENGTH = 0x50
    public static PACKET_STATUS_LENGTH = 0x20
    public static PACKET_DATA_LENGTH = 0x30

    /**
     * CatNip Builder Attribute
     */

    private frame: Uint8Array;
    private frameType: number | null;
    private packetLength: number | null;
    private packetType: number | null;
    private data: number | boolean | null;
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


    /**
     * To encode frame into an Uint8Array
     * Only STATUS frame can be encoded from server
     * The encoded frame is return by function and can be also access by this.getFrame()
     * @throws CatNipError
     */
    public encodeFrame() : Uint8Array {
        if (this.frameType===null||this.packetLength===null){
            this.detectFrameType()
            if (this.frameType===null||this.packetLength===null){
                throw new CatNipError(CatNipError.UNEXPECTED_ERROR,"frameType and/or packetLength not defined but should be defined")
            }
        }

        if (this.packetType===null){
            throw new CatNipError(CatNipError.CANT_BE_NULL,"PacketType")
        }

        if (this.frameType === CatNip.PACKET_HELLO) {
            throw new CatNipError(CatNipError.ENCODE_FRAME_ERROR,`HELLO(${CatNip.PACKET_HELLO.toString(16)})`)
        }

        if (this.frameType === CatNip.PACKET_DATA) {
            throw new CatNipError(CatNipError.ENCODE_FRAME_ERROR,`DATA(${CatNip.PACKET_DATA.toString(16)})`)
        }

        if (this.frameType === CatNip.PACKET_STATUS) {
            let tramBuilder = [CatNip.START_FRAME, this.packetLength,this.packetType]
            tramBuilder.push(CatNip.calculateCheckSum(tramBuilder))
            return this.frame = new Uint8Array(tramBuilder)
        }
        throw new CatNipError(CatNipError.UNKNOWN_TYPE_ERROR,this.frameType,"frameType")
    }

    /**
     * To decode incoming packet (if the packet is not the expected one that will throw error)
     * Every information that packet can contain was store in object itself
     * @param buffer
     * @throws CatNipError
     */
    public decodeFrame(buffer:Buffer){
        this.frame = new Uint8Array(buffer);
        if (this.frame[0]===CatNip.START_FRAME){
            if (this.frame[1]/8===this.frame.length){
                this.packetLength=this.frame[1]/8
                this.setPacketType=this.frame[2]
                if (this.packetType===null) throw new CatNipError(CatNipError.CANT_BE_NULL,"PacketType")
                this.detectFrameType();
                switch (this.frameType){
                    case CatNip.PACKET_HELLO:
                        if (CatNip.calculateCheckSum(this.frame)===this.frame[9]) {
                            this.clientMacAddress = this.frame.slice(3,9)
                            return true;
                        }
                        throw new CatNipError(CatNipError.DECODE_FRAME_ERROR,"Checksum","FRAME_HELLO")
                    case CatNip.PACKET_DATA:
                        if (CatNip.calculateCheckSum(this.frame)===this.frame[5]){
                            const dataBytes = this.frame.slice(3,5)
                            this.checksum = this.frame[5]

                            if ([CatNip.DATA_TEMPERATURE,CatNip.DATA_HUMIDITY].includes(this.packetType)){
                                //Automatically convert values
                                this.data = CatNip.concatenateBytes(dataBytes)[0]/10;
                                return true;
                            }
                            if (this.packetType==CatNip.DATA_ON){
                                //Return true or false
                                this.data = CatNip.concatenateBytes(dataBytes)[0]===1?true:false
                                return true;
                            }

                            if (this.packetType==CatNip.DATA_CONSUMATION) {
                                //default return
                                this.data = CatNip.concatenateBytes(dataBytes)[0]
                                return true;
                            }
                        }
                        throw new CatNipError(CatNipError.DECODE_FRAME_ERROR,"Checksum","FRAME_DATA")
                    case CatNip.PACKET_STATUS:
                        if (CatNip.calculateCheckSum(this.frame)===this.frame[3]){
                            this.checksum = this.frame[3]
                            return true;
                        }
                        throw new CatNipError(CatNipError.DECODE_FRAME_ERROR,"Checksum","FRAME_STATUS")
                    default:
                        throw new CatNipError(CatNipError.DECODE_FRAME_ERROR,"Unknown Frame : not a CATNIP frame")
                }
            }
            throw new CatNipError(CatNipError.DECODE_FRAME_ERROR,"Wrong Length : not a CATNIP frame")
        }
        throw new CatNipError(CatNipError.DECODE_FRAME_ERROR,"Not a CATNIP frame")
    }


    /**
     * This function will be detect the type of frame base of packetType
     * @private
     * @throws CatNipError
     */
    private detectFrameType() {
        if (this.packetType===null){
            throw new CatNipError(CatNipError.CANT_BE_NULL,"PacketType")
        }

        if (this.packetType === CatNip.STATUS_HELLO){
            this.frameType = CatNip.PACKET_HELLO;
            this.packetLength = CatNip.PACKET_HELLO_LENGTH;
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
            this.frameType = CatNip.PACKET_STATUS;
            this.packetLength = CatNip.PACKET_STATUS_LENGTH;
            return ;
        }

        if ([
            CatNip.DATA_CONSUMATION,
            CatNip.DATA_HUMIDITY,
            CatNip.DATA_ON,
            CatNip.DATA_TEMPERATURE,
        ].includes(this.packetType)) {
            this.frameType = CatNip.PACKET_DATA;
            this.packetLength = CatNip.PACKET_DATA_LENGTH;
        }

        throw new CatNipError(CatNipError.UNKNOWN_TYPE_ERROR,this.frameType,"frameType")
    }

    /**
     * Calculate the check sum of array
     * If the array is an Uint8Array the last item will be automatically remove
     * @param bytesArr
     * @return number
     */
    public static calculateCheckSum(bytesArr: Array<number>|Uint8Array) : number {
        if (bytesArr instanceof Uint8Array){
            bytesArr = bytesArr.subarray(0,bytesArr.length-1) //remove the checksum from frame to recalculate it
        }
        let sum = 0x0;
        for (let i = 0; i < bytesArr.length; i++) {
            sum += bytesArr[i];
        }
        return sum % 16 >> 0;
    }

    /**
     * Function able to concatenate every bytes of an Uint8Array
     * Into single cells of Uint32Array
     * Useful to get value that encode in more than 8 bits
     * @param bytesArray
     * @return Uint32Array
     */
    public static concatenateBytes(bytesArray: Uint8Array) : Uint32Array {
        let returnedValues = new Uint32Array(1);
        let bitNumber=(bytesArray.length*8)-1;
        for (let i = 0; i < bytesArray.length; i++) {
            for (let j=7;j>-1;j--){
                //console.log("bitNum",bitNumber,"i:",i," j:",j," bit:",this.readBit(bytesArray,i,j))
                this.setBit(returnedValues,0,bitNumber,this.readBit(bytesArray,i,j))
                bitNumber--
            }
        }
        return returnedValues
    }

    /**
     * To read single bit of bytes array
     * @param buffer bytes array
     * @param i the item number of array
     * @param bit the bit number that you want view
     * @return 0|1 the bit at selected address
     */
    public static readBit(buffer:Uint8Array|Uint16Array|Uint32Array, i:number, bit:number){
        return (buffer[i] >> bit) % 2;
    }

    /**
     * To write single bit of bytes array
     * @param buffer bytes array
     * @param i the item number of array
     * @param bit the bit number that you want edit
     * @param value 0|1 to set binary value.
     */
    public static setBit(buffer:Uint8Array|Uint16Array|Uint32Array, i:number, bit:number, value:number){
        if(value == 0){
            buffer[i] &= ~(1 << bit);
        }else if (value == 1){
            buffer[i] |= (1 << bit);
        }
    }

    /**
     * Setter !
     */
    
    /**
     * Set the packetType
     * @param packetType
     * @throws CatNipError
     */
    set setPacketType(packetType: number) {
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
        throw new CatNipError(CatNipError.UNKNOWN_TYPE_ERROR,this.packetType,"packetType")
    }

    /**
     * Getter !
     */

    get getFrame(){
        if (this.frame.byteLength!=0)
            return this.frame;
        throw new CatNipError(CatNipError.NOT_SET_ERROR,"frame")
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

    get getData(): number | boolean | null {
        return this.data;
    }

    get getClientMacAddress(): string {
        let returnData='';
        if (this.clientMacAddress===null){
            throw new CatNipError(CatNipError.NOT_SET_ERROR,"clientMacAddress")
        }
        for (let i = 0; i < this.clientMacAddress.length; i++) {
            returnData+=this.clientMacAddress[i].toString(16)
            if (i!==this.clientMacAddress.length-1)
                returnData+='-'
        }
        return returnData
    }

    get getChecksum(): number | null {
        return this.checksum;
    }
}
