export default class CatNip{

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
     * CatNip Builder Attribute
     */
    private tram:ArrayBuffer;
    private readonly packetType: number;
    private frameType: number;

    constructor() {
        this.packetType=0;
        this.frameType=0;
        this.tram=new ArrayBuffer(0);
    }

    /**
     * EncodeTrame
     */
    public encodeTrame(){
        this.detectFrameType()

        if (this.frameType === CatNip.FRAME_HELLO){
            throw "Can't Encode Frame HELLO From The Server"
        }

        if (this.frameType === CatNip.FRAME_DATA){
            throw "Can't Encode Frame DATA From The Server"
        }

        if (this.frameType === CatNip.FRAME_STATUS){
            let tramBuilder = [CatNip.START_TRAM,this.packetType]
            tramBuilder.push(CatNip.getCheckSum(tramBuilder))
            this.tram = new Uint8Array(tramBuilder)
        }

    }


    public detectFrameType(){
        if (this.packetType === CatNip.STATUS_HELLO)
            return this.frameType=CatNip.FRAME_HELLO;

        if ([
                CatNip.STATUS_ALIVE,
                CatNip.STATUS_RECEIVED,
                CatNip.ASK_HUMIDITY,
                CatNip.ASK_TEMPERATURE,
                CatNip.ASK_WATT,
                CatNip.ASK_IF_ON,
                CatNip.ACTION_ON,
                CatNip.ACTION_OFF
            ].includes(this.packetType))
            return this.frameType=CatNip.FRAME_STATUS;

        if ([
                CatNip.DATA_CONSUMATION,
                CatNip.DATA_HUMIDITY,
                CatNip.DATA_ON,
                CatNip.DATA_TEMPERATURE,
            ].includes(this.packetType))
            return this.frameType=CatNip.FRAME_DATA;

        throw "No Packet Type Indicate";
    }

    public static getCheckSum(bytesArr:Array<number>){
        let sum = 0x0;
        for (let i = 0; i < bytesArr.length; i++) {
            sum+=bytesArr[i];
        }
        return sum/16;
    }
}