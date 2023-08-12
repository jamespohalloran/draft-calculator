import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import {
  PebbleConfig,
  PebbleScene,
  Scene,
  transformPebbleObjs,
} from "@pebble-engine/engine";
import testScene from "../pebble/scenes/foo.json";
import pebbleConfig from "../pebble/config";

export default function Game() {
  return (
    <>
      {" "}
      {typeof window !== "undefined" && (
        <ProductionScene config={pebbleConfig} scene={testScene}>
          {(sceneRef) => (
            <div ref={sceneRef} style={{ width: "100%", height: "100%" }} />
          )}
        </ProductionScene>
      )}
    </>
  );
}

//TODO _ Wrap this up in pebbles offering
function useHookWithRefCallback() {
  const ref = useRef(null);
  const setRef = useCallback((node: any) => {
    ref.current = node;
  }, []);

  return [setRef, ref];
}

const ProductionScene = ({
  config,
  scene,
  children,
}: {
  config: PebbleConfig;
  scene: Scene;
  children: (sceneRef: React.RefObject<HTMLDivElement>) => ReactNode;
}) => {
  const [setSceneRef, sceneRef] = useHookWithRefCallback();

  const pebbleScene = useMemo(() => {
    const pebbleScene = new PebbleScene();
    const initialObjs = transformPebbleObjs(
      JSON.parse(JSON.stringify(scene.objects)),
      config
    );
    pebbleScene?.initializeObjects(initialObjs);
    return pebbleScene;
  }, []);

  useEffect(() => {
    if (sceneRef) {
      pebbleScene.setSceneRef(sceneRef as React.RefObject<HTMLDivElement>);
    }
  }, [sceneRef]);

  return <>{children(setSceneRef as React.RefObject<HTMLDivElement>)}</>;
};
