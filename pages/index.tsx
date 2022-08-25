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

const speedModifider = 0.001;

class Race {
  framesPassed = 0;

  results: Racer[] = [];

  constructor(public racers: Racer[]) {
    makeAutoObservable(this);
  }

  increaseTimer() {
    this.framesPassed += 1;

    this.racers.forEach((player) => {
      player.position = Math.min(
        player.position + player.speed * speedModifider,
        raceSize
      );

      if (player.position >= raceSize && !this.results.includes(player)) {
        if (this.results.length == 0) {
          let cheer = new Audio("/success-fanfare-trumpets-6185.mp3");
          cheer.play();
        }

        this.results.push(player);
      }
    });
  }

  adjustSpeed() {
    this.racers.forEach((player) => {
      player.speed = getRandomArbitrary(0.05, 200);
    });
  }
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const PlayerModal = observer(({ race }: { race: Race }) => {
  return (
    <>
      <div className="modal">
        <div className="modal-box space-y-2">
          <h1>Setup Race</h1>
          {race.racers.map((player, index) => (
            <div key={index} className="flex">
              <input
                key={index}
                type="text"
                placeholder={`User ${index + 1}'s name`}
                value={player.name}
                onChange={(e) => {
                  player.name = e.target.value.replace(" ", "_");
                }}
                className="flex-1 text-center input input-bordered center"
              />
              <button
                onClick={() => {
                  race.racers.splice(index, 1);
                }}
                className="ml-2 flex-none btn btn-square btn-outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
          <div className="text-center space-x-2">
            <button
              onClick={() => (race.racers = [...race.racers, new Racer("")])}
              className="place-self-center btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            >
              Add New User
            </button>
            <div className="modal-action">
              <label htmlFor="my-modal" className="btn">
                Start Race
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

const RaceTrack = observer(
  ({ race, running }: { race: Race; running: boolean }) => {
    return (
      <>
        <label htmlFor="my-modal" className="btn modal-button">
          Race Settings
        </label>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <PlayerModal race={race} />
        <div className="bg-green-300 w-full">
          {race.racers.map((player) => (
            <div key={player.name} className="w-full border border-inherit">
              <div
                className=""
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
            </div>
          ))}
        </div>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Results</th>
            </tr>
          </thead>
          {race.results.map((racer, i) => (
            <tr key={racer.name}>
              <td>{i + 1}</td>
              <td>{racer.name}</td>
            </tr>
          ))}
        </table>
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
      let whistle = new Audio("/065594_coach-whistle-88613.mp3");
      whistle.play();

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
        <div className="m-0.5">
          <h1 className="font-medium leading-tight text-2xl mt-0 mb-2 text-black-600">
            The League - Draft randomizer
          </h1>
          {!raceStarted && (
            <button
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => {
                setRaceStarted(true);
              }}
            >
              Start race
            </button>
          )}
        </div>

        <RaceTrack race={race} running={raceStarted} />
      </main>
    </div>
  );
};

export default Home;
