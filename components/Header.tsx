import React from "react";
import { GameManager } from "../pebble/prefabs";
import { useGameState } from "../utils/gameState";

import { Button } from "@/components/ui/button";
import { State } from "pebble/prefabs/gameManager";
import { IntroModal } from "components/IntroModal";

export const Header = ({ gameManager }: { gameManager: GameManager }) => {
  const gameState = useGameState(gameManager);
  return (
    <div className="p-2 px-4 flex bg-neutral w-full absolute">
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

      <div className="flex flex-row space-x-2 [&>*]:m-auto">
        <IntroModal />

        {gameState.state === State.race ? (
          <Button
            variant={"destructive"}
            className="btn-error btn btn-outline align-top text-white"
            onClick={() => {
              //refresh page with skipIntro query param
              window.location.search = "skipIntro";
            }}
          >
            Reset race
          </Button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
