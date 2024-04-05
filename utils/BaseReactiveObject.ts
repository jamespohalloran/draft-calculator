import { BaseObject, BaseObjectParams } from "@pebble-engine/core";

export class BaseReactiveObject extends BaseObject {
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
