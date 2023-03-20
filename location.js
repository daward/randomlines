class Location {
  constructor() {
    this.size = 0;
  }
  arrive(walker) {
    this.size++;
  }
  depart(walker) {
    this.size--
  }
}

module.exports = Location;