//REPLACE THE ACTUAL SCENE NAME / PATH
import { useEffect, useState } from "react";
import myScene from "../pebble/scenes/race.json";
import React from "react";
import * as THREE from "three";
import { PebbleScene } from "@pebble-engine/core";
import * as prefabs from "../pebble/prefabs";
import { GameUI } from "./GameUI";
import { Separator } from "@/components/ui/separator";
import KofiButton from "kofi-button";

let pebbleScene: PebbleScene;
//import prefabs in same format as below
function App() {
  const threeContainer = React.useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    //setup Three renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setClearAlpha(0);
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    //setup Three scene
    const scene = new THREE.Scene();

    //setup Pebble scene
    pebbleScene = new PebbleScene({ renderer, scene });

    // Need to track this incase we unbind before scene is loaded
    let bound = true;
    const container = threeContainer.current;

    const setupScene = async () => {
      await pebbleScene.loadScene({
        sceneData: myScene,
        prefabs,
      });
      if (bound) {
        // container!.appendChild(renderer.domElement);
      }
      setLoaded(true);
    };
    setupScene();

    return () => {
      //if container contains renderer, remove it
      if (container!.contains(renderer.domElement)) {
        // container!.removeChild(renderer.domElement);
        setLoaded(false);
      }
      bound = false;
    };
  }, []);

  return (
    <>
      {loaded ? <GameUI pebbleScene={pebbleScene} /> : <div>Loading...</div>}
      <footer className="footer items-center p-4 bg-neutral text-white w-full absolute bottom-0">
        <div className="items-center flex flex-row space-x-4 text-sm">
          <p>
            Made with ❤️ by <a href="http://johalloran.dev">James OHalloran.</a>
          </p>
          <Separator orientation="vertical" />
          <div className="">
            <a href="https://twitter.com/jamespohalloran">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
          </div>
          <div className="flex-auto"></div>
          <div className="">
            {" "}
            <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
