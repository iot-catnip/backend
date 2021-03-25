
export default function dataMerger (data:any,interval:number){
    let lastDate = data[0].date_mesure;
    let dataToSimplify = []
    let newData = []
    for (let i = 0; i < data.length; i++) {
        if (Math.abs(data[i].date_mesure-lastDate)<interval){
            dataToSimplify.push(data[i].valeur)
        }else {
            newData.push(data[i]);
            newData[newData.length-1].valeur= avg(dataToSimplify);
            dataToSimplify = []
            lastDate = newData[newData.length-1].date_mesure
        }
    }
    return newData
}

function middle(arr:Array<number>){
    arr.sort((a, b) => a - b);
    let lowMiddle = Math.floor((arr.length - 1) / 2);
    let highMiddle = Math.ceil((arr.length - 1) / 2);
    return (arr[lowMiddle] + arr[highMiddle]) / 2;
}

function avg(arr:Array<number>){
    let count = arr.length;
    let res = arr.reduce((previous, current) => current += previous);
    return Math.round((res /= count) * 100) / 100;
}

