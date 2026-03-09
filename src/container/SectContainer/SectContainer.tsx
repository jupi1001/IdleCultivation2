import React from "react";
import { SectScreen } from "./SectScreen";
import { useSectScreen } from "./useSectScreen";

export const SectContainer = () => {
  const model = useSectScreen();
  return <SectScreen {...model} />;
};
