function queryStringToArray(item) {
    console.log(item)
    item = item.replace('(', '')
    item = item.replace(')', '')
    var arr = item.split(',').map(Number)
    console.log(arr)
    return arr;
}
export{queryStringToArray}