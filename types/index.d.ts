// troika-three-text.d.ts

declare module "troika-three-text" {
  import * as THREE from "three";

  // Define the TextGeometry class
  export class TextGeometry extends THREE.BufferGeometry {
    constructor(text: string, options?: TextGeometryOptions);
  }

  export type Text = any;

  // Define the TextGeometry options interface
  interface TextGeometryOptions {
    font?: THREE.Font;
    fontSize?: number;
    letterSpacing?: number;
    lineHeight?: number;
    anchor?: THREE.Vector2;
    align?: string;
    color?: THREE.Color | string | number;
    material?: THREE.Material;
    overflowWrap?: boolean;
    whiteSpace?: string;
    wordBreak?: string;
    maxWidth?: number;
    tabSize?: number;
    outlineWidth?: number;
    anchorX?: string | number;
    anchorY?: string | number;
    direction?: string;
    depthOffset?: number;
  }
}
