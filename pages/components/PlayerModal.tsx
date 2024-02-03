import { GameManager } from "../../pebble/prefabs";
import { useGameState } from "../utils/gameState";

export const PlayerModal = ({ gameManager }: { gameManager: GameManager }) => {
  const gameState = useGameState(gameManager);

  return (
    <>
      <div className="modal text-white">
        <div className="modal-box space-y-2">
          <div className="mb-6">
            <label className="block text-white text-md font-bold mb-2">
              Users
            </label>
            {gameState.players.map((player, index) => (
              <div key={player._id} className="flex mb-2">
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
                    //race.racers.splice(index, 1);
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
                // race.racers = [...race.racers, new Racer("")];
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
              defaultValue={gameState.speedModifier}
              className="range"
              step={0.0005}
              onChange={({ target: { value } }) => {
                gameManager.setSpeedModifier(parseFloat(value));
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
