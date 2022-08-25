import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

class Racer {
  speed = 0;
  position = 0;
  constructor(public name: string) {
    makeAutoObservable(this);
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
}

const raceSize = 95;

class Race {
  framesPassed = 0;

  results: Racer[] = [];

  constructor(public racers: Racer[]) {}

  increaseTimer() {
    this.framesPassed += 1;

    this.racers.forEach((player) => {
      player.position = Math.min(player.position + player.speed, raceSize);

      if (player.position >= raceSize && !this.results.includes(player)) {
        this.results.push(player);
      }
    });
  }

  adjustSpeed() {
    this.racers.forEach((player) => {
      player.speed = getRandomArbitrary(0.1, 0.5);
    });
  }
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const RaceTrack = observer(
  ({ race, running }: { race: Race; running: boolean }) => {
    return (
      <>
        <div className="bg-green-300 w-full">
          {race.racers.map((player) => (
            <div
              className=""
              key={player.name}
              style={{ marginLeft: `${player.position}%`, width: "30px" }}
            >
              {player.name}
              <img
                className="w-full"
                src={
                  running && !race.results.find((r) => r.name == player.name)
                    ? "/run.gif"
                    : "idle.png"
                }
              />
              {/* <Runner /> */}
            </div>
          ))}
        </div>
        <h2>Results:</h2>
        <br />
        {race.results.map((racer, i) => (
          <div key={racer.name}>
            {i + 1} : {racer.name}
          </div>
        ))}
      </>
    );
  }
);

const race = new Race([
  new Racer("Brodie"),
  new Racer("James"),
  new Racer("Chris"),
  new Racer("Colin"),
  new Racer("Ernesto"),
  new Racer("Mike"),
  new Racer("Chad"),
  new Racer("Dave"),
  new Racer("AndrewMac"),
  new Racer("AndrewBurt"),
  new Racer("Ryan"),
  new Racer("Josh"),
]);

const Home: NextPage = () => {
  const [raceStarted, setRaceStarted] = useState(false);

  useEffect(() => {
    if (raceStarted) {
      race.increaseTimer();
      setInterval(() => {
        race.increaseTimer();
      }, 50);

      race.adjustSpeed();
      setInterval(() => {
        race.adjustSpeed();
      }, 1000);
    }
  }, [raceStarted]);

  return (
    <div className="w-screen h-screen">
      <main>
        {!raceStarted && (
          <div className="m-0.5">
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => {
                setRaceStarted(true);
              }}
            >
              Start race
            </button>
          </div>
        )}
        <RaceTrack race={race} running={raceStarted} />
      </main>
    </div>
  );
};

export default Home;
