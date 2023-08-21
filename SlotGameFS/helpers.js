function loadJson(jsonFileName){
    jsonObjs = require('./'+jsonFileName+'.json')
    return jsonObjs
}

function getIndexByWeight(arr, val){
    let tot = 0;
    let i = 0;
    do{
        tot += arr[i];
        i++;
    }while(tot <= val)
    
    return i > 0 ? i-1 : 0;
}

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const arrayColumn = (arr, n) => arr.map((x) => x[n]);

function getRandomFloat(min, max, decimals) {
    return parseFloat(Math.random() * (max - min) + min).toFixed(decimals);
}

module.exports = {loadJson,generateRandomIntegerInRange,getRandomFloat,getIndexByWeight};

