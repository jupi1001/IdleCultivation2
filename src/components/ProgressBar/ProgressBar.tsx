import React from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  bgcolor: string;
  completed: number;
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { bgcolor, completed } = props;

  const fillerStyles: React.CSSProperties = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 1s ease-in-out",
  };

  return (
    <div className="containerStyles">
      <div style={fillerStyles}>
        <span className="labelStyles">{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
