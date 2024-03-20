import { Input } from "@/components/ui/input";
import { GameManager } from "../pebble/prefabs";
import { useGameState } from "../utils/gameState";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export const PlayerModal = ({ gameManager }: { gameManager: GameManager }) => {
  const gameState = useGameState(gameManager);

  return (
    <>
      <div className="h-1/2">
        <div className=" space-y-2">
          <div className="mb-6">
            <label className="block text-white text-md font-bold mb-2">
              Users
            </label>
            <div className=" grid grid-cols-2 gap-4">
              {gameState.players.map((player, index) => (
                <div key={player._id}>
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      placeholder={`User ${index + 1}'s name`}
                      value={player.name}
                      onChange={(e) => {
                        player.setName(e.target.value.replace(" ", "_"));
                      }}
                      className="flex-auto"
                    />{" "}
                    <Button
                      onClick={() => gameManager.removePlayer(player._id)}
                    >
                      {" "}
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
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center space-x-2">
            <Button
              onClick={() => {
                gameManager.addPlayer();
              }}
            >
              {" "}
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
            </Button>
          </div>
          <div className="">
            <Label>Race Speed</Label>

            <Slider
              defaultValue={[gameState.speedModifier]}
              max={0.031}
              step={0.005}
              min={0.001}
              onValueChange={(value: any) => {
                gameManager.setSpeedModifier(parseFloat(value[0]));
              }}
            />
            {/* 
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
            /> */}
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
