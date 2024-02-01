//REPLACE THE ACTUAL SCENE NAME / PATH
import { useEffect, useState } from "react";
import myScene from "../pebble/scenes/race.json";
import React from "react";
import * as THREE from "three";
import { PebbleScene } from "@pebble-engine/core";
import * as prefabs from "../pebble/prefabs";
import { Player } from "../pebble/prefabs";

//REPLACE THE ACTUAL PATH TO PREFABS
const PlayerModal = ({ race }: { race: Race }) => {
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
              // cacheManager.updateCache();
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
};

let pebbleScene: PebbleScene;
//import prefabs in same format as below
function App({ running, race }: { running: boolean; race: Race }) {
  const threeContainer = React.useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //setup Three renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearAlpha(0);
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    //setup Three scene
    const scene = new THREE.Scene();

    //setup Pebble scene
    pebbleScene = new PebbleScene({ renderer, scene });

    // Need to track this incase we unbind before scene is loaded
    let bound = true;
    const container = threeContainer.current;

    const setupScene = async () => {
      await pebbleScene.loadScene({
        sceneData: myScene,
        prefabs,
      });
      if (bound) {
        container!.appendChild(renderer.domElement);
      }
      setLoaded(true);
    };
    setupScene();

    return () => {
      //if container contains renderer, remove it
      if (container!.contains(renderer.domElement)) {
        container!.removeChild(renderer.domElement);
        setLoaded(false);
      }
      bound = false;
    };
  }, []);

  useEffect(() => {
    if (running) {
      (
        pebbleScene.objects.filter((o) => o._prefabId === "Player") as Player[]
      ).forEach((player: Player) => {
        player.running = true;
      });
    }
  }, [running]);

  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <PlayerModal race={race} />
      <div className="bg-gradient-to-b from-blue-300 to-blue-600">
        {/* gradient background */}
        <div ref={threeContainer} className=""></div>
        {loaded ? <></> : <div>Loading</div>}
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

export default App;
