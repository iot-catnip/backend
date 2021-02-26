export default class CatNip{
    public static START_TRAM = 0x02
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
    public static ASK_FOR_ON = 0x61
    public static ASK_FOR_OFF = 0x60

    private tram:ArrayBuffer;
    private value:number= 0;
    private type:0x00;

    constructor() {
        this.value = 0;
        this.type=0;
        this.tram=new ArrayBuffer(0);
    }

    /**
     * @todo faire la fonction d'encodage de tram
     */
    public encodeTrame(){
    }

    /**
     * @todo faire la fonction d'encodage de tram
     */
    public selectTrame(){
    }
}