import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

function uniqueID() {
  return Math.floor(Math.random() * Date.now());
}

class Racer {
  speed = 0;
  position = 0;
  id: number;
  constructor(public name: string) {
    makeAutoObservable(this);
    this.id = uniqueID();
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
}

const CACHE_SETTINGS_KEY = "race-settings";
class CacheManager {
  constructor() {}

  public loadFromState() {
    const cache = JSON.parse(localStorage?.getItem(CACHE_SETTINGS_KEY) || "{}");

    if (!cache?.racers) {
      race.racers.push(new Racer("Player_1"));
      race.racers.push(new Racer("Player_2"));
      race.racers.push(new Racer("Player_3"));
      race.racers.push(new Racer("Player_4"));
      race.racers.push(new Racer("Player_5"));
      race.racers.push(new Racer("Player_6"));
      race.racers.push(new Racer("Player_7"));
      race.racers.push(new Racer("Player_8"));
      race.racers.push(new Racer("Player_9"));
      race.racers.push(new Racer("Player_10"));
      return;
    }
    (cache.racers || []).forEach((racer: { name: string }) => {
      race.racers.push(new Racer(racer.name));
    });
  }

  public updateCache() {
    localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(race));
  }
}

const raceSize = 100;

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

const race = new Race([
  // new Racer("Brodie"),
  // new Racer("James"),
  // new Racer("Chris"),
  // new Racer("Colin"),
  // new Racer("Ernesto"),
  // new Racer("Mike"),
  // new Racer("Chad"),
  // new Racer("Dave"),
  // new Racer("AndrewMac"),
  // new Racer("AndrewBurt"),
  // new Racer("Ryan"),
  // new Racer("Josh"),
]);

const cacheManager = new CacheManager();

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
            <div key={player.id} className="flex">
              <input
                type="text"
                placeholder={`User ${index + 1}'s name`}
                value={player.name}
                onChange={(e) => {
                  player.name = e.target.value.replace(" ", "_");
                  cacheManager.updateCache();
                }}
                className="flex-1 text-center input input-bordered center"
              />
              <button
                onClick={() => {
                  race.racers.splice(index, 1);
                  cacheManager.updateCache();
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
              onClick={() => {
                race.racers = [...race.racers, new Racer("")];
                cacheManager.updateCache();
              }}
              className="place-self-center text-white btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            >
              Add New User
            </button>
            <div className="modal-action">
              <label htmlFor="my-modal" className="text-white btn">
                Done
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

const RACER_WIDTH = 30;

const RaceTrack = observer(
  ({ race, running }: { race: Race; running: boolean }) => {
    return (
      <>
        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        <PlayerModal race={race} />
        <div className="p-2">
          <div className="pr-8 checkered">
            <div className="bg-green-600 w-full">
              {race.racers.map((player) => {
                const isDone = race.results.find((r) => r.name == player.name);

                return (
                  <div key={player.id} className="w-full border border-inherit">
                    <div
                      className=""
                      style={{
                        marginLeft: `${player.position}%`,
                        width: `${RACER_WIDTH}px`,
                      }}
                    >
                      <span
                        className={`badge text-white ${
                          isDone && "float-right"
                        }`}
                      >
                        {player.name}
                      </span>
                      <img
                        className="w-full"
                        src={running && !isDone ? "/run.gif" : "idle.png"}
                      />
                      {/* <Runner /> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {running && (
          <div className="m-2">
            <table className="table-auto table rounded-sm">
              <thead>
                <tr>
                  <th>Results</th>
                  <th></th>
                </tr>
              </thead>
              {race.racers.map((_, i) => (
                <tr key={i} className="bg-white text-black outline">
                  <th>{i + 1}</th>
                  <td>{race.results.length > i ? race.results[i].name : ""}</td>
                </tr>
              ))}
            </table>
          </div>
        )}
      </>
    );
  }
);

const Home: NextPage = () => {
  const [raceStarted, setRaceStarted] = useState(false);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      cacheManager.loadFromState();
    }
  }, []);

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
    <div className="w-screen min-h-screen bg-green-800">
      <main>
        <div className="p-2">
          <h1 className="font-medium leading-tight text-2xl text-black-600">
            The League - Draft randomizer
          </h1>
          {!raceStarted && (
            <div className="space-x-2 mt-4">
              <button
                className="btn align-top text-white"
                onClick={() => {
                  setRaceStarted(true);
                }}
              >
                Start race
              </button>
              <label
                htmlFor="my-modal"
                className="btn btn-outline modal-button text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            </div>
          )}
        </div>

        <RaceTrack race={race} running={raceStarted} />
      </main>
    </div>
  );
};

export default Home;
