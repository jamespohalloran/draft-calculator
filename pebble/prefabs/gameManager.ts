import { PebbleScene, editable } from "@pebble-engine/core";
import Player from "./player";
import { BaseReactiveObject } from "../../utils/BaseReactiveObject";
import * as THREE from "three";

interface GameState {
  players: Player[];
  results: any[];
  state: State;
  speedModifier: number;
}

export enum State {
  intro,
  playerSelect,
  race,
  results,
}
export default class GameManager extends BaseReactiveObject {
  private players: Player[] = [];
  private _gameState: GameState;
  private _speedModifier: number = 0.0025;
  private _camera?: THREE.Camera;

  @editable({ type: "vector3" })
  public mapOffset: THREE.Vector3;

  @editable({ type: "vector3" })
  public mapDimensions: THREE.Vector3;

  private _targetCamTransform?: {
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
  };
  private speedAdjustmentInterval: NodeJS.Timeout;

  private state: State = State.intro;

  private _pebbleScene?: PebbleScene;
  public constructor({
    name,
    threeObj,
    _id,
    ...initialProps
  }: {
    name: string;
    _id: string;
    threeObj: any;
  }) {
    console.log("GameManager constructor");
    super({ name, threeObj, _id });

    this.mapDimensions =
      (initialProps as any).mapDimensions || new THREE.Vector3(10, 10, 10);
    this.mapOffset = new THREE.Vector3(0, 0, 0);

    this._gameState = {
      players: [],
      results: [],
      state: this.state,
      speedModifier: this._speedModifier,
    };

    this.speedAdjustmentInterval = setInterval(() => {
      this.adjustPlayerSpeeds();
    }, 1000);
  }

  public get speedModifier() {
    return this._speedModifier;
  }

  protected override getGizmos() {
    // Create a box geometry
    const boxGeometry = new THREE.BoxGeometry(
      this.mapDimensions.x,
      this.mapDimensions.y,
      this.mapDimensions.z
    );
    boxGeometry.translate(
      this.mapOffset.x / 2,
      this.mapOffset.y / 2,
      this.mapOffset.z / 2
    );

    // Create a wireframe material
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x00ff00,
    });

    return [new THREE.Mesh(boxGeometry, wireframeMaterial)];
  }

  public setSpeedModifier(value: number) {
    this._speedModifier = value;
    this.updateGameState();
  }

  public set running(value: boolean) {
    if (value) {
      this.state = State.race;
    } else {
      this.state = State.intro;
    }
    this.updateGameState();
  }

  public override update(delta: number) {
    if (this.state === State.race) {
      this.checkForComplete();

      const rotSpeed = 3.5;

      //calculate targetCamPos. The cam should be at x0, z0, and it should see all of mapDimensions x&z
      const fieldOfView =
        (this._camera! as THREE.PerspectiveCamera).fov * (Math.PI / 180);

      var height = Math.tan(fieldOfView / 2) * this.mapDimensions.z;
      var width = Math.sin(fieldOfView / 2) * this.mapDimensions.x;

      this._targetCamTransform?.position.set(
        0,
        Math.max(height, width) + 0.25,
        0
      );

      //slerp with qm.slerpQuaternions( qa, qb, t )
      this._camera!.quaternion.slerp(
        this._targetCamTransform!.quaternion,
        delta * rotSpeed
      );

      // Apply the interpolated rotation to your object
      // yourObject.setRotationFromQuaternion(interpolatedRotation);

      this._camera!.position.lerp(
        this._targetCamTransform!.position!,
        delta * rotSpeed
      );

      //  this._camera!.lookAt(0, 0, 0);
    } else {
      if (this._gameState.state === State.playerSelect) {
        // move camera in front of all the players
        this._camera!.position.y = 1;
        this._camera!.position.x = 0;
        this._camera!.position.z = 2;
        this._camera?.lookAt(
          this.players.length
            ? this.players[this.players.length / 2].threeObj!.position
            : new THREE.Vector3(0, 0, 0)
        );
      } else {
        //slowly circle camera around players
        this._camera!.position.y = 3;
        this._camera!.position.x = Math.sin(Date.now() * 0.00005) * 7;
        this._camera!.position.z = Math.cos(Date.now() * 0.00005) * 7;
        this._camera!.lookAt(0, 0, 2);
      }
    }
  }

  private updateGameState() {
    this._gameState = {
      players: this.players,
      results: [], // Add logic to update results if needed
      state: this.state,
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
    this._pebbleScene = _pebbleScene;
    const initialPlayerProps = {
      threeObj: {
        position: { x: -1, y: 0.2, z: this.mapDimensions.z / 2 },
        rotation: { x: 0, y: 180, z: 0 },
        scale: { x: 0.25, y: 0.25, z: 0.25 },
      },

      //   BoxColliderBehaviour: {
      //     kinetic: false, // maybe change this later, but this collides with new arrows and changes position
      //     offset: { x: 0, y: 0, z: 0 },
      //     dimensions: { x: 0.1, y: 0.5, z: 0.1 },
      //   },
    } as any;

    const playerCount = 10;
    const initialXOffset = this.mapDimensions.x / 2;
    const spacing = this.mapDimensions.x / playerCount;

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
            x: -i * spacing + initialXOffset,
          },
        },
      };
      const newObj = new Player(newProps);

      await _pebbleScene.instantiate(newObj);
      _pebbleScene.scene.add(newObj.threeObj!);
      this.players.push(newObj);
      newObj.subscribe(() => {
        this.updateGameState();
      });
    };

    Promise.all(
      Array.from({ length: playerCount }, (_, i) => i).map((i) =>
        instantiatePlayer({ i })
      )
    ).then(() => {
      this.updateGameState();
    });

    this._camera = _pebbleScene.camera!;
    this._targetCamTransform = {
      position: this._camera.position.clone(),
      quaternion: this._camera.quaternion.clone(),
    };
  }

  private checkForComplete() {
    this.players
      .filter((p) => !p.complete)
      .forEach((player) => {
        const endPos = -this.mapDimensions.z / 2;
        if (player.threeObj!.position.z <= endPos) {
          player.setComplete(this.players.filter((p) => p.complete).length + 1);
          player.threeObj!.position.z = endPos;
        }
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
