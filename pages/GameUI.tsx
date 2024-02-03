import { PebbleScene } from "@pebble-engine/core";
import { GameManager } from "../pebble/prefabs";
import React, { useEffect } from "react";
import { Header } from "./components/Header";
import { PlayerModal } from "./components/PlayerModal";

export const GameUI = ({ pebbleScene }: { pebbleScene: PebbleScene }) => {
  const gameManager = pebbleScene.objects.find(
    (o) => o._prefabId === "GameManager"
  ) as GameManager;

  const threeContainer = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = threeContainer.current;

    container!.appendChild(pebbleScene.renderer.domElement);

    return () => {
      container!.removeChild(pebbleScene.renderer.domElement);
    };
  }, []);

  return (
    <>
      <div className="w-screen min-h-screen bg-green-800">
        <main>
          <Header gameManager={gameManager} />
          {/* <RaceTrack race={race} running={raceStarted} /> */}
          <div className="bg-gradient-to-b from-blue-300 to-blue-600">
            {/* gradient background */}
            <div ref={threeContainer} className=""></div>
          </div>
          {/* {gameManager.running && (
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
                    <td>
                      {race.results.length > i ? race.results[i].name : ""}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          )}{" "} */}
        </main>
      </div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <PlayerModal gameManager={gameManager} />
    </>
  );
};
