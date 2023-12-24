import React from "react";
import "./FishingArea.css";

interface FishingAreaProps {
  title: string;
  imageSrc: string;
  altText: string;
  fishingXP: number;
  fishingDelay: number;
  onClick: () => void;
}

const FishingArea: React.FC<FishingAreaProps> = ({ title, imageSrc, altText, fishingXP, fishingDelay, onClick }) => {
  return (
    <div className="fishingAreaContainer__main-item">
      <h2>{title}</h2>
      <p>
        FishingXP: {fishingXP} FishingDelay: {fishingDelay}{" "}
      </p>
      <img
        src={imageSrc}
        alt={altText}
        height={50}
        onClick={onClick}
        onMouseEnter={() => (document.body.style.cursor = "pointer")}
        onMouseLeave={() => (document.body.style.cursor = "default")}
      />
    </div>
  );
};

export default FishingArea;
