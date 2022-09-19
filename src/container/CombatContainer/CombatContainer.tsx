import React from "react";

interface CombatAreaProps {
  area: string | undefined;
}

const CombatContainer: React.FC<CombatAreaProps> = ({ area }) => {
  return (
    <div>
      <h3>{area}</h3>
    </div>
  );
};

export default CombatContainer;
