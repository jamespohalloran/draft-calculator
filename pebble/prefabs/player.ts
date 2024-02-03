import { BaseObjectParams, editable } from "@pebble-engine/core";
import * as THREE from "three";
//@ts-ignore
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//@ts-ignore
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

import { Text } from "troika-three-text";
import { BaseReactiveObject } from "../../utils/BaseReactiveObject";

export default class Player extends BaseReactiveObject {
  static prefab: GLTF;

  @editable
  public speed: number = 3;

  @editable
  public wobbleSpeed: number = 8;

  @editable
  public wobbleIntensity: number = 0.1;

  @editable({ type: "asset" })
  public assetName: string = "/minigames/character/character_dog.gltf";

  private clock: THREE.Clock;
  private label: Text;

  private _running = false;

  private complete = false;
  public constructor(initialProps: BaseObjectParams) {
    super(initialProps);
    this.clock = new THREE.Clock();
  }

  public get running() {
    return this._running;
  }
  public set running(value: boolean) {
    this._running = value;
  }

  public override start(_pebbleScene: any): void {}

  public override update(delta: number) {
    if (!this.running) {
      return;
    }
    if (!this.complete) {
      this.checkForComplete();
    }

    if (!this.complete) {
      this.threeObj!.position.z = Math.max(
        -3,
        this.threeObj!.position.z - this.speed * delta
      );

      this.threeObj!.rotation.z =
        Math.sin(this.wobbleSpeed * this.clock.getElapsedTime()) *
        this.wobbleIntensity;
    }
  }

  private checkForComplete() {
    if (this.isComplete()) {
      this.complete = true;
      this.threeObj!.position.z = -3;
      this.threeObj!.rotation.z = 0;
    }
  }

  private isComplete = () => {
    return this.threeObj!.position.z <= -3;
  };

  protected override async getThreeObject() {
    try {
      const prefab = await this.loadPrefab();
      const newobj = SkeletonUtils.clone(prefab.scene);

      this.label = new Text();
      this.label.rotation.y = -Math.PI / 2;

      newobj!.add(this.label);

      // Set properties to configure:
      this.label.text = this.name;
      this.label.fontSize = 0.4;
      this.label.position.x = 0;
      this.label.position.y = 2.3;
      this.label.position.z = 0;
      this.label.anchorX = "center";
      this.label.color = 0x000000;

      this.label.sync();

      return newobj;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  public setName = (name: string) => {
    this.name = name;
    this.updateLabel(name);
  };

  private updateLabel = (text: string) => {
    this.label.text = text;
    this.notifySubscribers();
  };

  loadPrefab = async (): Promise<GLTF> => {
    const loader = new GLTFLoader();

    // Load a glTF resource

    return new Promise((resolve, reject) => {
      loader.load(
        // resource URL
        this.assetName,
        // called when the resource is loaded
        function (gltf: any) {
          resolve(gltf);
        },

        // called while loading is progressing
        function () {
          // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        function (error: any) {
          console.log("An error happened", error);
          reject(error);
        }
      );
    });
  };
}
