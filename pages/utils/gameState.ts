import { useSyncExternalStore } from "react";
import { GameManager } from "../../pebble/prefabs";

export const useGameState = (gameManager: GameManager) => {
  return useSyncExternalStore(
    gameManager.subscribe.bind(gameManager),
    gameManager.getGameState.bind(gameManager)
  );
};
