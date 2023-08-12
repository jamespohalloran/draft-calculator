import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import Script from "next/script";
import KofiButton from "kofi-button";
import dynamic from "next/dynamic";

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

const Game = dynamic(() => import("../components/game"), { ssr: false });

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

  return (
    <div className="w-screen min-h-screen bg-green-800">
      <main>
        <div className="p-2 px-4 flex bg-neutral text-white">
          <h1 className="self-center flex-none font-medium leading-tight text-2xl align-middle">
            DraftOrders
          </h1>
          <div className="self-center flex-none ml-2 invisible md:visible">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12c0-1.232.046-2.453.138-3.662a4.006 4.006 0 013.7-3.7 48.678 48.678 0 017.324 0 4.006 4.006 0 013.7 3.7c.017.22.032.441.046.662M4.5 12l-3-3m3 3l3-3m12 3c0 1.232-.046 2.453-.138 3.662a4.006 4.006 0 01-3.7 3.7 48.657 48.657 0 01-7.324 0 4.006 4.006 0 01-3.7-3.7c-.017-.22-.032-.441-.046-.662M19.5 12l-3 3m3-3l3 3"
              />
            </svg>
          </div>
          <div className="flex-auto"></div>

          <div className="flex-none space-x-2">
            <a target="_blank" href="/about">
              <div className="inline-block text-white cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
            </a>
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
            {raceStarted ? (
              <button
                className="btn-error btn btn-outline align-top text-white"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reset race
              </button>
            ) : (
              <button
                className="btn btn-outline align-top text-white"
                onClick={() => {
                  setRaceStarted(true);
                }}
              >
                Start race
              </button>
            )}
          </div>
        </div>
        <Game />
        <RaceTrack race={race} running={raceStarted} />
      </main>
      <footer className="footer items-center p-4 bg-neutral text-white">
        <div className="items-center grid-flow-col">
          <svg
            width={36}
            height={36}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z" />
          </svg>
          <p>
            Developed by <a href="http://johalloran.dev">James OHalloran.</a>
          </p>

          <KofiButton color="#0a9396" title="Tip the dev" kofiID="S6S5EMUTW" />
          <div className="">
            {" "}
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
          </div>
        </div>

        <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a href="https://twitter.com/jamespohalloran">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};
export default Home;
