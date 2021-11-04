import fhmKommun from './fetchers/fhm_kommun.js'

let startFetchers = async function () {
    await fhmKommun()
}

export { startFetchers as startFetchers }