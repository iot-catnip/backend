export default class CatNipError extends Error{
    public static UNEXPECTED_ERROR = "UNEXPECTED_ERROR"
    public static CANT_BE_NULL = "CANT_BE_NULL"
    public static UNKNOWN_TYPE_ERROR = "UNKNOWN_TYPE_ERROR"
    public static ENCODE_FRAME_ERROR = "ENCODE_FRAME_ERROR"
    public static DECODE_FRAME_ERROR = "DECODE_FRAME_ERROR"
    public static NOT_SET_ERROR = "NOT_SET_ERROR"

    constructor(...args:any) {
        super(...args);
        this.name="CATNIP Error"
        if (args.length>0){
            this.name +=" "+ args[0]
            if (args[1])
                this.message = args[1]
            switch (args[0]){
                case CatNipError.CANT_BE_NULL:
                    if (args[1])
                        this.message = args[1]+" cant be null"
                    break;
                case CatNipError.UNKNOWN_TYPE_ERROR:
                    if (args[2]){
                        this.message = `${args[1].toString(16)} is not CATNIP ${args[2]}`
                    }else if (args[1])
                        this.message = args[1]+" is unknown CATNIP type"
                    break;
                case CatNipError.ENCODE_FRAME_ERROR:
                    if (args[1])
                        this.message = `Can't encode frame ${args[1]} from the Server`
                    break;
                case CatNipError.NOT_SET_ERROR:
                    if (args[1])
                        this.message = args[1]+" is not set"
                case CatNipError.DECODE_FRAME_ERROR:
                    if (args[1])
                        if (args[1]=="Checksum")
                            this.message= "The checksum is not verify for "+args[2]
            }
        }

        Error.captureStackTrace(this,CatNipError)
    }
}