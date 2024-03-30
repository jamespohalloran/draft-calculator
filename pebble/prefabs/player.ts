import { BaseObjectParams, PebbleScene, editable } from "@pebble-engine/core";
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

  mixer: THREE.AnimationMixer | undefined;

  animActions: { [key: string]: THREE.AnimationAction };

  currentAction: THREE.AnimationAction | undefined;

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

  private _place: number | undefined;
  public constructor(initialProps: BaseObjectParams) {
    super(initialProps);
    this.clock = new THREE.Clock();
    this.animActions = {};
  }

  public get complete() {
    return !!this._place;
  }

  public get place() {
    return this._place;
  }

  public get running() {
    return this._running;
  }
  public set running(value: boolean) {
    this._running = value;

    if (value) {
      this.playAnimation("Jog");
    }

    if (this._running) {
      this.label.position.y = 0;
    }
  }

  public setLabelOffset(camPosition: { x: number; y: number; z: number }) {
    // set label position offset based on distance on x axis from camera
    return;
    this.label.position.x =
      0.1 - 0.03 * (this.threeObj!.position.x - camPosition.x);
  }

  public override start(pebbleScene: any): void {
    // TODO - not called because of a bug in the engine
    // setup animation
  }

  public override update(delta: number) {
    this.mixer?.update(delta);

    if (!this.running) {
      return;
    }

    if (!this.complete) {
      this.mixer!.timeScale = this.wobbleSpeed * 0.01;

      this.threeObj!.position.z -= this.speed * delta;

      // this.threeObj!.rotation.z =
      //   Math.sin(this.wobbleSpeed * this.clock.getElapsedTime()) *
      //   this.wobbleIntensity;
    }
  }

  public setComplete = (place: number) => {
    this._place = place;
    this.threeObj!.rotation.z = 0;
    this.showPlaceLabel(place);

    if (place === 1) {
      this.playAnimation("Victory");
    } else {
      this.playAnimation("Defeat");
    }
  };

  private playAnimation = (newAnim: "Victory" | "Jog" | "Defeat" | "Idle") => {
    const newAnimation = this.animActions[newAnim];

    if (this.currentAction) {
      this.currentAction.crossFadeTo(newAnimation, 0.5, true);
    }
    newAnimation.play();

    this.currentAction = newAnimation;
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
      this.label.fontSize = 0.3;
      this.label.position.x = -0.3;
      this.label.position.y = 1.3;
      this.label.position.z = 0;
      this.label.anchorX = "center";
      this.label.font = "/fonts/kenvector_future_thin.ttf";
      this.label.outlineColor = 0xffffff;
      this.label.outlineWidth = 0.02;
      this.label.color = 0x000000;

      this.label.material = labelMat;

      this.label.sync();

      this.mixer = new THREE.AnimationMixer(newobj as any);

      this.animActions = ["Idle", "Defeat", "Victory", "Jog"].reduce(
        (actions, animName) => {
          actions[animName] = this.mixer!.clipAction(
            (prefab.animations as any[]).find((anim) => {
              return anim.name == animName;
            })
          );
          return actions;
        },
        {} as { [key: string]: THREE.AnimationAction }
      );

      this.playAnimation("Idle");

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
            gl_Position.z = 1.0; // Set z-coordinate to 1 to render on top
        `,
    ...options,
  });
}
