import React from "react";

export const Map = () => {
  const handleOnClick = (e: { preventDefault: () => void }) => {
    console.log("You have clicked in the specified area");
  };

  return (
    <div>
      <img
        width="600px"
        src="https://www.nationsonline.org/maps/china_provinces_map1200.jpg"
        alt="Map"
        useMap="#workmap"
      />
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
  );
};
