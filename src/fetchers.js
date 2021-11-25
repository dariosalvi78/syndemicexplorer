import fhm_kommun from './fetchers/fhm_kommun.js';

let startFetchers = async function () {
  await fhm_kommun();
};

// export { startFetchers as startFetchers }
