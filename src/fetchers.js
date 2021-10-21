import { fhmKommun } from './fetchers/fhm_kommmun.js'

let startFetchers = async function () {
    await fhmKommun()
}

export { startFetchers as startFetchers }