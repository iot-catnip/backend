export default class TimedRemover {

    public static async removeFromCollection(data: any, collection: Array<any>, time: number, callback: (agr1: Array<any>, arg2: any)=>void)
    {
        setTimeout(()=>{
            try{
                callback(collection, data);
            }catch (e) {

            }
        }, time)
    }

}