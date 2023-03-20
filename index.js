const _ = require("lodash");
const Location = require("./location");
const Walker = require("./walker");

const numberOfLocations = 4;

const settings = {
  waitTime: 2,
  travelTime: 2,
  numberOfWalkers: 200
}

const initialize = () => {
  const locations = [];
  const walkers = [];

  for (let i = 0; i < numberOfLocations; i++) {
    locations.push(new Location())
  }

  for (let i = 0; i < settings.numberOfWalkers; i++) {
    const currentLocation = locations[Math.floor(Math.random() * numberOfLocations)];
    walkers.push(new Walker({
      locations,
      currentLocation,
      settings
    }))
  }

  return {
    locations,
    walkers
  }
}

const run = () => {
  
  let totalRuns = 0;
  const numRuns = 200
  for (let x = 0; x < numRuns; x++) {
    let runs = 0;
    const { locations, walkers } = initialize();
    while (runs < 2000) {
      walkers.forEach(walker => walker.tick());
      walkers.forEach(walker => walker.commit());
      let distributionDifference = 0;
      for (let j = 0; j < numberOfLocations; j++) {
        distributionDifference += Math.abs(locations[j].size - (settings.numberOfWalkers / numberOfLocations))
      }
      if (distributionDifference === 0) {
        break;
      }
      runs++;
    }
    totalRuns += runs;
  }
  return totalRuns / numRuns;
}

for (let i = 100; i < 3000; i+=100) {
  settings.waitTime = 75;
  settings.numberOfWalkers = i
  console.log(`${run()}`);
}
