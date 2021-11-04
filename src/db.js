import pg from 'pg'
const { Pool } = pg

let pool

// helper function that does an UPSERT of tables with a similar timeseries structure
// must be fed with an object like:
// { table: 'epidemiology', source: 'USA-XXX', date: '2020-03-24', country_code: 'USA',
//   area1_code: 'US.1_1', area2_code: 'US.1_1.2_2', area3_code: 'US.1_1.2_2.3_3',
//   tested: 1000, confirmed: 150, recovered: 3, dead: 1, hospitalised: 15,
//  hospitalised_icu: 2, quarantined: 13, vaccianted_partial: 234, vaccianted_complete: 321 }
// not all fields are mandatory
let upsertTimeseries = async function(arg) {
    if (arg.table === undefined) throw new Error('table must be defined')
    if (arg.source === undefined) throw new Error('source must be defined')
    if (arg.date === undefined) throw new Error('date must be defined')
    if (arg.country_code === undefined) throw new Error('country_code must be defined')
    if (arg.gid === undefined) throw new Error('gid must be defined')

  let fields = []
  let values = []

  for (let field in arg) {
    if (arg[field] !== undefined) {
      if(field == 'table') {
        continue;
      }
      fields.push(field)
      values.push(arg[field])
    }
  }

  let queryText = 'INSERT INTO ' + arg.table +' ('
  for (let i = 0; i < fields.length; i++) {
    queryText += fields[i]
    if (i < fields.length - 1) queryText += ', '
  }

  queryText += ') \n VALUES ('
  for (let i = 0; i < fields.length; i++) {
    queryText += '$' + (i+1) + ', '
  }
  // remove last comma
  queryText = queryText.slice(0, -2)

  queryText += ") \n ON CONFLICT (source, date, country_code, COALESCE(area1_code, ''), COALESCE(area2_code, ''), COALESCE(area3_code, ''))"
  queryText += '\n DO UPDATE SET '
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] !=='source' && fields[i] !== 'date' && fields[i] !== 'country_code'
    && fields[i] !== 'area1_code' && fields[i] != 'area2_code' && fields[i] != 'area3_code') {
      queryText += fields[i] + '= $' + (i+1) + ', '
    }
  }
  queryText = queryText.slice(0, -2)
  queryText += '\n RETURNING *;'

  let queryObj = {
    text: queryText,
    values: values
  }
  try {
    await pool.query(queryObj)
  } catch (err) {
    console.error('Problem executing query', queryObj)
    throw err
  }
}

export function  initDB () {
    pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    })    
}

export {upsertTimeseries as upsertTimeseries}

export {pool as Pool}