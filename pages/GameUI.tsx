import { PebbleScene } from "@pebble-engine/core";
import { GameManager } from "../pebble/prefabs";
import React, { useEffect } from "react";
import { Header } from "./components/Header";
import { PlayerModal } from "./components/PlayerModal";
import { useGameState } from "./utils/gameState";
import { IntroModal } from "components/IntroModal";

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
          <div className="bg-gradient-to-b from-blue-300 to-blue-600">
            <div ref={threeContainer} className=""></div>
          </div>
          <IntroModal />
        </main>
      </div>
    </>
  );
};
