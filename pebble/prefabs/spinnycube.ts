import * as THREE from "three";
import {
  BaseObject,
  BaseBehaviour,
  Vector3,
  editable,
} from "@pebble-engine/engine";

// type for any class that extends BaseBehaviour

class SpinnyCubeBehaviour extends BaseBehaviour {
  @editable
  public test: string;
  public foo: string;
  public constructor(object: BaseObject, data: { test: string }) {
    super(object);
    this.test = data.test || "test";
    this.foo = "foo";
  }
  public render() {
    this._object.transform.rotation.x += 0.03;
    this._object.transform.rotation.y += 0.01;
  }
}

export default class SpinnyCube extends BaseObject {
  public constructor({
    mesh,
    name,
    transform,
    _id,
  }: {
    mesh: THREE.Mesh;
    name: string;
    _id: string;
    transform: {
      position: Vector3;
      rotation: Vector3;
      scale: Vector3;
    };
  }) {
    super({ mesh, name, transform, _id });
    //this.scripts.push(new SpinnyCubeBehaviour(this));

    this.registerScript(SpinnyCubeBehaviour);
  }
}
