const raceSize = 100;
// const cacheManager = new CacheManager();

function uniqueID() {
  return Math.floor(Math.random() * Date.now());
}

class Racer {
  speed = 0;
  position = 0;
  id: number;
  constructor(public name: string) {
    // makeAutoObservable(this);
    this.id = uniqueID();
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
}

class Race {
  framesPassed = 0;

  results: Racer[] = [];

  constructor(public racers: Racer[], public speedModifier: number) {
    // makeAutoObservable(this);
  }

  increaseTimer() {
    this.framesPassed += 1;

    this.racers.forEach((player) => {
      player.position = Math.min(
        player.position + player.speed * this.speedModifier,
        raceSize
      );

      if (player.position >= raceSize && !this.results.includes(player)) {
        if (this.results.length == 0) {
          let cheer = new Audio("/success-fanfare-trumpets-6185.mp3");
          cheer.volume = 0.08;
          cheer.play();
        }

        this.results.push(player);
      }
    });
  }

  adjustPlayerSpeeds() {
    this.racers.forEach((player) => {
      player.speed = getRandomArbitrary(0.05, 200);
    });
  }
}
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
