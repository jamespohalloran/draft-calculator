import { BaseObject, PebbleScene } from "@pebble-engine/core";
import Player from "./player";

export default class GameManager extends BaseObject {
  public constructor({
    name,
    threeObj,
    _id,
  }: {
    name: string;
    _id: string;
    threeObj: any;
  }) {
    super({ name, threeObj, _id });
  }

  public start(_pebbleScene: PebbleScene): void {
    const initialPlayerProps = {
      threeObj: {
        position: { x: -1, y: 1, z: 3 },
        rotation: { x: 0, y: 180, z: 0 },
        scale: { x: 0.25, y: 0.25, z: 0.25 },
      },

      //   BoxColliderBehaviour: {
      //     kinetic: false, // maybe change this later, but this collides with new arrows and changes position
      //     offset: { x: 0, y: 0, z: 0 },
      //     dimensions: { x: 0.1, y: 0.5, z: 0.1 },
      //   },
    } as any;

    const spacing = 0.5;
    const playerCount = 10;
    const initialXOffset = -3;
    //instantiate players at x positions 0-9, with a promise.all
    const instantiatePlayer = async ({ i }: any) => {
      // clone initialProps, but replace threeObj.position.x with i
      const newProps = {
        ...initialPlayerProps,
        threeObj: {
          ...initialPlayerProps.threeObj,
          position: {
            ...initialPlayerProps.threeObj.position,
            x: i * spacing + initialXOffset,
          },
        },
      };
      const newObj = new Player(newProps);

      await _pebbleScene.instantiate(newObj);
      _pebbleScene.scene.add(newObj.threeObj!);
    };

    Promise.all(
      Array.from({ length: playerCount }, (_, i) => i).map((i) =>
        instantiatePlayer({ i })
      )
    );

    debugger;
  }
}
