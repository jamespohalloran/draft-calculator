//REPLACE THE ACTUAL SCENE NAME / PATH
import { useEffect, useState } from "react";
import myScene from "../pebble/scenes/race.json";
import React from "react";
import * as THREE from "three";
import { PebbleScene } from "@pebble-engine/core";

//REPLACE THE ACTUAL PATH TO PREFABS

//import prefabs in same format as below
const prefabs = {
  car: () => import("../pebble/prefabs/car"),
  flycam: () => import("../pebble/prefabs/flycam"),
  player: () => import("../pebble/prefabs/player"),
};

// const prefabs = import.meta.glob("../pebble/prefabs/*.ts");

function App() {
  const threeContainer = React.useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //setup Three renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    //setup Three scene
    const scene = new THREE.Scene();

    //setup Pebble scene
    const pebbleScene = new PebbleScene({ renderer, scene });

    // Need to track this incase we unbind before scene is loaded
    let bound = true;
    const container = threeContainer.current;

    const setupScene = async () => {
      await pebbleScene.loadScene({
        sceneData: myScene,
        prefabs,
      });
      if (bound) {
        container!.appendChild(renderer.domElement);
      }
    };
    setupScene();

    return () => {
      //if container contains renderer, remove it
      if (container!.contains(renderer.domElement)) {
        setLoaded(true);
        container!.removeChild(renderer.domElement);
      }
      bound = false;
    };
  }, []);

  return (
    <>
      <div ref={threeContainer}></div>
      {loaded ? <></> : <div>Loading</div>}
    </>
  );
}

export default App;
