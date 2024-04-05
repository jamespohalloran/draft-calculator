import { BaseObject, editable } from "@pebble-engine/core";
//@ts-ignore
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

//@ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
export default class Car extends BaseObject {
  static prefab: GLTF;

  @editable({ type: "asset" })
  public assetName: string = "/city/car_sedan.gltf";

  public constructor(initialProps: any) {
    super(initialProps);
  }

  public override start(_pebbleScene: any): void {
    //
  }

  public override update(delta: number) {
    this.threeObj!.position.x += delta * 0.8;
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
