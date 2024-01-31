import { BaseObjectParams, BaseObject, editable } from "@pebble-engine/core";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

export default class Player extends BaseObject {
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

  public constructor(initialProps: BaseObjectParams) {
    super(initialProps);
    this.clock = new THREE.Clock();
  }

  public override start(_pebbleScene: any): void {
    //
  }

  public override update(delta: number) {
    this.threeObj!.position.z -= this.speed * delta;

    this.threeObj!.rotation.z =
      Math.sin(this.wobbleSpeed * this.clock.getElapsedTime()) *
      this.wobbleIntensity;
  }

  protected override async getThreeObject() {
    try {
      const prefab = await this.loadPrefab();
      const newobj = SkeletonUtils.clone(prefab.scene);
      return newobj;
    } catch (e) {
      console.error(e);
      return;
    }
  }

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
