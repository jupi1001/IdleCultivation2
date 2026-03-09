import React from "react";
import { SettingsScreen } from "./SettingsScreen";
import { Theme, useSettingsScreen } from "./useSettingsScreen";

interface SettingsContainerProps {
  theme?: Theme;
  setTheme?: (t: Theme) => void;
}

export const SettingsContainer = ({ theme = "dark", setTheme }: SettingsContainerProps) => {
  const model = useSettingsScreen();
  return <SettingsScreen theme={theme} setTheme={setTheme} {...model} />;
};
