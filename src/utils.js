function queryStringToArray(item) {
    item = item.replace('(', '')
    item = item.replace(')', '')
    var arr = item.split(',').map(Number)
    return arr;
}
export{queryStringToArray}