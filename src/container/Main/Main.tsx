import React from "react";
import { ContentBlock } from "../../components/ContentBlock/ContentBlock";
import { LeftMain } from "../LeftMain/LeftMain";
import { RightMain } from "../RightMain/RightMain";

import "./Main.css";

export const Main = () => {
  const handleOnClick = (e: { preventDefault: () => void }) => {
    console.log("You have clicked in the specified area");
  };

  return (
    <div className="app__main">
      <div className="app__main-left">
        <LeftMain />
      </div>
      <div className="app__main-img">
        <img src="https://www.nationsonline.org/maps/china_provinces_map1200.jpg" alt="Map" useMap="#workmap" />
        <map id="workmap" name="workmap">
          <area
            shape="rect"
            coords="200,200,300,300"
            alt="test"
            href="https://c1.staticflickr.com/5/4052/4503898393_303cfbc9fd_b.jpg"
            onClick={handleOnClick}
          />
        </map>
      </div>
      <div className="app__main-right">
        <RightMain />
      </div>
    </div>
  );
};
