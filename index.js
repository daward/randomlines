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

for (let walkerSize = 2000; walkerSize <= 2000; walkerSize += 100) {
  let minCyclesPerWalker = 5;
  let minWaitTime = 600;
  let minTime = 100000;

  for (let waitTime = 500; waitTime <= 1000; waitTime += 10) {
    settings.waitTime = waitTime;
    settings.numberOfWalkers = walkerSize;
    const timeTaken = run();
    const cyclesPerWalker = timeTaken / walkerSize;

    if(cyclesPerWalker < minCyclesPerWalker) {
      minCyclesPerWalker = cyclesPerWalker;
      minWaitTime = waitTime
      minTime = timeTaken;
    }
  }
  console.log(`${minWaitTime}, ${minCyclesPerWalker}`)
}
