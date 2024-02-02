import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import Script from "next/script";
import KofiButton from "kofi-button";
import App from "./App";

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
    race.speedModifier = cache.speedModifier;
  }

  public updateCache() {
    localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(race));
  }
}

const raceSize = 100;

class Race {
  framesPassed = 0;

  results: Racer[] = [];

  constructor(public racers: Racer[], public speedModifier: number) {
    makeAutoObservable(this);
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

const race = new Race([], 0.001);

const cacheManager = new CacheManager();

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const PlayerModal = observer(({ race }: { race: Race }) => {
  return (
    <>
      <div className="modal text-white">
        <div className="modal-box space-y-2">
          <div className="mb-6">
            <label className="block text-white text-md font-bold mb-2">
              Users
            </label>
            {race.racers.map((player, index) => (
              <div key={player.id} className="flex mb-2">
                <input
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
                  className="ml-2 my-0 flex-none btn btn-squar btn btn-outline"
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
          </div>
          <div className="text-center space-x-2">
            <button
              onClick={() => {
                race.racers = [...race.racers, new Racer("")];
              }}
              className="place-self-center text-white btn btn-outline"
            >
              Add New User{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-1"
                width={"16px"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14m7-7H5"
                />
              </svg>
            </button>
          </div>
          <div className="">
            <label className="block text-white text-md font-bold mb-2">
              Race Speed
            </label>
            <input
              type="range"
              min={0.0005}
              max={0.005}
              defaultValue={race.speedModifier}
              className="range"
              step={0.0005}
              onChange={({ target: { value } }) => {
                race.speedModifier = parseFloat(value);
              }}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </div>

          <div
            className="mt-6 modal-action"
            onClick={() => {
              cacheManager.updateCache();
            }}
          >
            <label htmlFor="my-modal" className="text-white btn btn-outline">
              Done
            </label>
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
                          running ? "float-right" : ""
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
      //make the volume lower
      whistle.volume = 0.08;
      whistle.play();

      race.increaseTimer();
      const timer = setInterval(() => {
        race.increaseTimer();
      }, 50);

      race.adjustPlayerSpeeds();
      const speedAdjustment = setInterval(() => {
        race.adjustPlayerSpeeds();
      }, 1000);

      return () => {
        clearInterval(timer);
        clearInterval(speedAdjustment);
      };
    }
  }, [raceStarted]);

  return <App race={race} />;
};
export default Home;
