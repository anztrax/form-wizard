import { useEffect, useState } from "react";

let globalModalLayerCounter = 0;

export function useModalLayer() {
  const [layerIndex] = useState(() => {
    globalModalLayerCounter += 1;
    return globalModalLayerCounter;
  });

  useEffect(() => {
    return () => {
      globalModalLayerCounter -= 1;
      if (globalModalLayerCounter < 0) {
        globalModalLayerCounter = 0;
      }
    };
  }, []);

  const baseZIndex = 1000 + (layerIndex - 1) * 20;

  return {
    overlayZIndex: baseZIndex,
    dialogZIndex: baseZIndex + 1,
  };
}
