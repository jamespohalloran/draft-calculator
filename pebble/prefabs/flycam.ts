import * as THREE from "three";
import {
  BaseObject,
  BaseBehaviour,
  editable,
  PebbleScene,
} from "@pebble-engine/core";

// WASD keyboard controls
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};

class SpinnyCamBehaviour extends BaseBehaviour {
  @editable
  public moveSpeed: number = 5;

  @editable
  public rotationSpeed: number = 0.04;

  private scene: PebbleScene = {} as PebbleScene;

  private keydownHandler: any;
  private keyupHandler: any;
  private lockCamHandler: any;
  private mouseMoveHandler: any;

  private targetRotation = new THREE.Vector2(0, 0);
  private currentRotation = new THREE.Vector2(0, 0);

  public start(_pebbleScene: PebbleScene) {
    this.scene = _pebbleScene;

    this.keydownHandler = this.keydown.bind(this);
    this.keyupHandler = this.keyup.bind(this);
    this.mouseMoveHandler = this.mouseMove.bind(this);

    document.addEventListener("click", this.lockCamHandler);
    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
    document.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private keydown(event: { key: "w" | "a" | "s" | "d" }) {
    if (event.key in keys) {
      keys[event.key] = true;
    }
  }

  private keyup(event: { key: "w" | "a" | "s" | "d" }) {
    if (event.key in keys) {
      keys[event.key] = false;
    }
  }

  private mouseMove(event: MouseEvent) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    // Cap the rotation to a certain range (adjust as needed)
    const maxRotationX = 0.1; //Math.PI / 2; // 90 degrees
    const maxRotationY = 0.03; //Math.PI / 2; // 90 degrees

    this.targetRotation.x = -Math.max(
      -maxRotationX,
      Math.min(maxRotationX, mouseX)
    );
    this.targetRotation.y = -Math.max(
      -maxRotationY,
      Math.min(maxRotationY, mouseY)
    );
  }

  public constructor(object: BaseObject) {
    super(object);
  }

  public update(delta: number) {
    const direction = new THREE.Vector3();

    this._object.threeObj!.getWorldDirection(direction);

    const facingDirection = this._object.threeObj!.getWorldDirection(direction);
    facingDirection.setY(0); // Set Y component to 0

    const movingDirection = new THREE.Vector3(); // Initialize the moving direction as a zero vector

    if (keys.w) {
      movingDirection.add(facingDirection);
    }
    if (keys.a) {
      const leftDirection = new THREE.Vector3(
        facingDirection.z,
        0,
        -facingDirection.x
      );
      movingDirection.add(leftDirection);
    }
    if (keys.s) {
      const backDirection = new THREE.Vector3(
        -facingDirection.x,
        0,
        -facingDirection.z
      );
      movingDirection.add(backDirection);
    }
    if (keys.d) {
      const rightDirection = new THREE.Vector3(
        -facingDirection.z,
        0,
        facingDirection.x
      );
      movingDirection.add(rightDirection);
    }

    // // Normalize the movingDirection vector if it's not a zero vector
    if (movingDirection.length() > 0) {
      movingDirection.normalize();
    }

    // // Update the position of the object based on the movingDirection and moveSpeed
    this._object.threeObj!.position.add(
      movingDirection.multiplyScalar(this.moveSpeed * delta)
    );

    this.currentRotation.lerp(this.targetRotation, this.rotationSpeed);

    this._object.threeObj!.rotation.set(
      this.currentRotation.y,
      this.currentRotation.x,
      0
    );
  }

  public override destroy() {
    document.removeEventListener("keydown", this.keydownHandler);
    document.removeEventListener("keyup", this.keyupHandler);
    document.removeEventListener("mousemove", this.mouseMoveHandler);
  }
}

export default class FlyCam extends BaseObject {
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
    this.registerScript(SpinnyCamBehaviour);
  }

  protected override getThreeObject() {
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    return camera;
  }

  static LoadAssets = async () => {
    return Promise.resolve();
  };
}
