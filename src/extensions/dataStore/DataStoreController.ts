export default class DataStoreController {
    private static _instance: DataStoreController;

    private data: any = {};

    public static getInstance()
    {
        if(DataStoreController._instance == undefined) {
            DataStoreController._instance = new DataStoreController();
            return DataStoreController._instance;
        }else{
            return DataStoreController._instance;
        }
    }

    public addData(dataName: string, dataValue: any)
    {
        if(this.data[dataName] == undefined)
        {
            this.data[dataName] = dataValue;
            return this.data[dataName];
        }else{
            return this.data[dataName];
        }
    }

    public getData(dataName: string)
    {
        return this.data[dataName];
    }

    public getAllData()
    {
        return this.data;
    }

}