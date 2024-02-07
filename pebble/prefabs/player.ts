import { BaseObjectParams, editable } from "@pebble-engine/core";
import * as THREE from "three";
//@ts-ignore
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//@ts-ignore
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
//@ts-ignore
import { createDerivedMaterial } from "troika-three-utils";

import { Text } from "troika-three-text";
import { BaseReactiveObject } from "../../utils/BaseReactiveObject";

export default class Player extends BaseReactiveObject {
  static prefab: GLTF;

  mixer: any;

  animations: any[];

  @editable
  public speed: number = 3;

  @editable
  public wobbleSpeed: number = 8;

  @editable
  public wobbleIntensity: number = 0.1;

  @editable({ type: "asset" })
  public assetName: string = "/footballer.glb";

  private clock: THREE.Clock;
  private label: Text;
  private placeLabel: Text;

  private _running = false;

  private _complete = false;
  public constructor(initialProps: BaseObjectParams) {
    super(initialProps);
    this.clock = new THREE.Clock();
    this.animations = [];
  }

  public get complete() {
    return this._complete;
  }

  public get running() {
    return this._running;
  }
  public set running(value: boolean) {
    this._running = value;

    if (value) {
      const runAnimation = this.animations.find((anim) => {
        return anim.name == "Jog";
      });
      const action = this.mixer.clipAction(runAnimation);
      action.play();
    }
  }

  public override start(_pebbleScene: any): void {
    // setup animation
  }

  public override update(delta: number) {
    this.mixer?.update(delta);

    if (!this.running) {
      return;
    }

    if (!this._complete) {
      this.mixer.timeScale = this.speed * 3;

      this.threeObj!.position.z -= this.speed * delta;

      // this.threeObj!.rotation.z =
      //   Math.sin(this.wobbleSpeed * this.clock.getElapsedTime()) *
      //   this.wobbleIntensity;
    }
  }

  public setComplete = (place: number) => {
    this._complete = true;
    this.threeObj!.rotation.z = 0;
    this.showPlaceLabel(place); // TODO - replace with index of player in game manager

    let doneAnim;
    debugger;
    if (place === 1) {
      doneAnim = this.animations.find((anim) => {
        return anim.name == "Victory";
      });
    } else {
      doneAnim = this.animations.find((anim) => {
        return anim.name == "Defeat";
      });
      const action = this.mixer.clipAction(doneAnim);
      action.play();
    }
  };

  private showPlaceLabel = (place: number) => {
    // generate string from place. E.g 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th, etc.
    let placeString = place.toString();
    if (placeString.length > 1) {
      const lastDigit = placeString.charAt(placeString.length - 1);
      if (lastDigit === "1") {
        placeString += "st";
      } else if (lastDigit === "2") {
        placeString += "nd";
      } else if (lastDigit === "3") {
        placeString += "rd";
      } else {
        placeString += "th";
      }
    } else {
      if (placeString === "1") {
        placeString += "st";
      } else if (placeString === "2") {
        placeString += "nd";
      } else if (placeString === "3") {
        placeString += "rd";
      } else {
        placeString += "th";
      }
    }

    this.placeLabel.text = placeString;
    this.placeLabel.visible = true;
  };

  protected override async getThreeObject() {
    try {
      const prefab = await this.loadPrefab();
      const newobj = SkeletonUtils.clone(prefab.scene);

      const labelMat = create3dLabelMaterial(new THREE.MeshBasicMaterial(), {
        uniforms: {
          u_positionOffsetX: { value: 0 },
          u_positionOffsetY: { value: 0 },
        },
      });

      this.placeLabel = new Text();
      this.placeLabel.visible = false;
      this.placeLabel.rotation.y = -Math.PI / 2;
      this.placeLabel.text = "";
      this.placeLabel.fontSize = 0.35;
      this.placeLabel.fontWeight = "bold";
      this.placeLabel.anchorX = "center";
      this.placeLabel.color = 0x000000;
      this.placeLabel.position.x = 0;
      this.placeLabel.position.y = 3;
      this.placeLabel.position.z = 0;
      this.placeLabel.material = labelMat;
      this.placeLabel.sync();
      newobj!.add(this.placeLabel);

      this.label = new Text();
      this.label.rotation.y = -Math.PI / 2;

      newobj!.add(this.label);

      // Set properties to configure:
      this.label.text = this.name;
      this.label.fontSize = 0.2;
      this.label.position.x = 0;
      this.label.position.y = 1.3;
      this.label.position.z = 0;
      this.label.anchorX = "center";
      this.label.color = 0x000000;

      this.label.material = labelMat;

      this.label.sync();

      this.mixer = new THREE.AnimationMixer(newobj as any);
      this.animations = prefab.animations; //newobj.animations;

      const idleAnimation = this.animations.find((anim) => {
        return anim.name == "Idle";
      });
      const action = this.mixer.clipAction(idleAnimation);
      action.play();

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

function create3dLabelMaterial(
  baseMaterial: THREE.Material,
  options: Partial<any> = {}
): THREE.ShaderMaterial {
  return createDerivedMaterial(baseMaterial, {
    uniforms: options.uniforms,
    vertexMainOutro: `
            vec4 modelViewPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            vec3 modelViewScale = vec3(
                length(modelViewMatrix[0].xyz),
                length(modelViewMatrix[1].xyz),
                length(modelViewMatrix[2].xyz)
            );

            modelViewPosition.xyz += position * modelViewScale;
            gl_Position = projectionMatrix * modelViewPosition;
        `,
    ...options,
  });
}
