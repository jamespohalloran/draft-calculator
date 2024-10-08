import { PebbleScene } from "@pebble-engine/core";
import { GameManager } from "../pebble/prefabs";
import React, { useEffect } from "react";
import { Header } from "./Header";
import { useGameState } from "../utils/gameState";
import { State } from "pebble/prefabs/gameManager";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlayerModal } from "./PlayerModal";

export const GameUI = ({ pebbleScene }: { pebbleScene: PebbleScene }) => {
  const gameManager = pebbleScene.objects.find(
    (o) => o._prefabId === "GameManager"
  ) as GameManager;

  const threeContainer = React.useRef<HTMLDivElement>(null);

  const gameState = useGameState(gameManager);

  useEffect(() => {
    if (!gameState.loaded) {
      return;
    }
    const container = threeContainer.current;

    container!.appendChild(pebbleScene.renderer.domElement);

    return () => {
      container!.removeChild(pebbleScene.renderer.domElement);
    };
  }, [gameState.loaded]);

  const results = gameState.players
    .filter((p) => !!p.place)
    .sort((a, b) => {
      return a.place! - b.place!;
    });

  return (
    <>
      <div className="w-screen min-h-screen bg-green-800">
        <main>
          <Header gameManager={gameManager} />
          <div className="bg-gradient-to-b from-blue-300 to-blue-600">
            <div ref={threeContainer} className=""></div>
          </div>
          <PlayerModalDialogue gameManager={gameManager}>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-2">
              {gameState.state === State.intro && (
                <>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="btn btn-outline align-top"
                      variant={"secondary"}
                    >
                      <span className="pr-1">Configure Players{"  "}</span>
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
                    </Button>
                  </AlertDialogTrigger>
                  <Button
                    className="btn btn-outline align-top text-white"
                    onClick={() => {
                      gameManager.startRace();
                    }}
                  >
                    Start race
                  </Button>
                </>
              )}
            </div>
          </PlayerModalDialogue>
          {gameState.state == State.race && results.length && (
            <div className="p-2 px-4 absolute top-[50px]">
              <p>Results</p>
              <table className="table-auto table rounded-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                {results.map((_, i) => (
                  <tr key={i} className="bg-white text-black outline">
                    <th className="p-2">{i + 1}.</th>
                    <td className="p-2">
                      {results.length > i ? results[i].name : ""}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

function PlayerModalDialogue({
  gameManager,
  children,
}: {
  gameManager: GameManager;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (open) {
          gameManager.setState(State.playerSelect);
        } else {
          gameManager.setState(State.intro);
        }
      }}
    >
      <AlertDialogContent className="max-h-[90vh] overflow-scroll">
        <AlertDialogHeader>
          <AlertDialogTitle>Race Settings</AlertDialogTitle>
          <AlertDialogDescription>
            <PlayerModal gameManager={gameManager} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      {children}
    </AlertDialog>
  );
}
