import React from "react";
import { ImmortalsIslandScreen } from "./ImmortalsIslandScreen";
import { useImmortalsIslandScreen } from "./useImmortalsIslandScreen";
import "./ImmortalsIslandContainer.css";

export const ImmortalsIslandContainer = () => {
  const model = useImmortalsIslandScreen();
  return <ImmortalsIslandScreen {...model} />;
};
