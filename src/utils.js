function queryStringToArray(item) {
    item = item.replace('(', '')
    item = item.replace(')', '')
    return item.split(',').map(Number)
}

// get query for area, names and geometry
function getQuery(text) {
    return `select distinct ` + text + `_name, ` + text + `_code, (st_xmin(st_envelope(geometry)), st_ymin(st_envelope(geometry)), 
    st_xmax(st_envelope(geometry)), st_ymax(st_envelope(geometry))) as bounding_box, 
    ST_AsGeoJSON(geometry) as geometry from admin_areas\n    `
}

export{queryStringToArray, getQuery}