import { BaseObject, BaseObjectParams, PebbleScene } from "@pebble-engine/core";
import Player from "./player";

class BaseReactiveObject extends BaseObject {
  private subscribers = new Set<() => void>();

  constructor(props: BaseObjectParams) {
    super(props);
  }

  public subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public notifySubscribers() {
    this.subscribers.forEach((callback) => callback());
  }
}

interface GameState {
  players: Player[];
  results: any[];
  running: boolean;
  speedModifier: number;
}

export default class GameManager extends BaseReactiveObject {
  private players: Player[] = [];
  private _gameState: GameState;
  private _speedModifier: number = 0.0025;

  private speedAdjustmentInterval: NodeJS.Timeout;

  private _running: boolean = false;
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

    this._gameState = {
      players: [],
      results: [],
      running: this._running,
      speedModifier: this._speedModifier,
    };

    this.speedAdjustmentInterval = setInterval(() => {
      this.adjustPlayerSpeeds();
    }, 1000);
  }

  public get speedModifier() {
    return this._speedModifier;
  }

  public setSpeedModifier(value: number) {
    this._speedModifier = value;
    this.updateGameState();
  }

  public set running(value: boolean) {
    debugger;

    this._running = value;
    this.updateGameState();
  }

  private updateGameState() {
    this._gameState = {
      players: this.players,
      results: [], // Add logic to update results if needed
      running: this._running,
      speedModifier: this._speedModifier,
    };

    this.notifySubscribers();
  }

  public getGameState() {
    // return the game state
    return this._gameState;
  }

  public addPlayer() {}

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
        name: `Player ${i + 1}`,
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
      this.players.push(newObj);
    };

    Promise.all(
      Array.from({ length: playerCount }, (_, i) => i).map((i) =>
        instantiatePlayer({ i })
      )
    ).then(() => {
      this.updateGameState();
    });
  }

  startRace() {
    let whistle = new Audio("/065594_coach-whistle-88613.mp3");
    //make the volume lower
    whistle.volume = 0.08;
    whistle.play();
    this.running = true;

    this.adjustPlayerSpeeds();
    this.players.forEach((player) => {
      player.running = true;
    });
  }

  private adjustPlayerSpeeds() {
    this.players.forEach((player) => {
      player.speed = getRandomArbitrary(0.05, 200) * this._speedModifier;
    });
  }

  public override destroy() {
    clearInterval(this.speedAdjustmentInterval);
  }
}

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
