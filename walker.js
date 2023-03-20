const _ = require("lodash");
class Walker {
  constructor({ locations, currentLocation, settings }) {
    this.currentLocation = currentLocation;
    this.nextLocation = null;
    this.travelTime = 0;
    this.locations = locations;
    this.targetSize = settings.numberOfWalkers / locations.length;
    currentLocation.arrive(this);
    this.action = null;
    this.waitTime = Math.floor(Math.random() * settings.waitTime);
    this.currentWaitTime = this.waitTime;
    this.settings = settings;
  }

  depart() {
    const destination = _.orderBy(_.shuffle(this.locations), location => location.size)[0];

    if (destination !== this.currentLocation) {
      this.action = () => {
        this.currentLocation.depart(this);
        this.nextLocation = destination;
        this.currentLocation = null;
        this.travelTime = Math.ceil(Math.random() * this.settings.travelTime);
      }
    }

  }

  arrive() {
    this.currentLocation = this.nextLocation;
    this.nextLocation = null;
    this.currentLocation.arrive(this);
  }

  tick() {
    // we're not travelling
    if (this.currentLocation) {
      // we are waiting
      if(this.currentWaitTime !== 0) {
        this.currentWaitTime--;
      } else if(this.targetSize < this.currentLocation.size){
        this.currentWaitTime = this.waitTime;
        this.depart()
      }

      // if we're traveling, then keep doing so
    } else {
      this.action = () => {
        this.travelTime--;
        if (this.travelTime === 0) {
          this.arrive();
        }
      }
    }
  }

  commit() {
    if (this.action) {
      this.action();
      this.action = null;
    }
  }
}

module.exports = Walker;