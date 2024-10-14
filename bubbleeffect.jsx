import React, { useState, useEffect, useCallback } from "react";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import Child from "./ChildComponent.jsx";
import { data } from "./data";
import "./styles.css";

export default function BubleEffect() {
  const [bubble, setBubble] = useState("");
  const [scales, setScales] = useState({});

  const options = {
    size: 100,
    minSize: 30,
    gutter: 8,
    provideProps: true,
    numCols: 6,
    fringeWidth: 100,
    yRadius: 100,
    xRadius: 100,
    cornerRadius: 150,
    showGuides: false,
    compact: false,
    gravitation: 5,
  };

  useEffect(() => {
    const bubbles = document.querySelectorAll(".bubble-container");
    bubbles.forEach((bubble, index) => {
      const bubbleId = index;
      let bubbleScale = scales[bubbleId] || 1;

      const handleWheel = (e) => {
        console.log("rvwd", e.deltaY)
        e.preventDefault();
        const zoomSpeed = 0.1;
        let newScale = bubbleScale - e.deltaY * zoomSpeed;
        newScale = Math.min(Math.max(0.5, newScale), 2);

        setScales((prevScales) => ({ ...prevScales, [bubbleId]: newScale }));
        bubbleScale = newScale;

        const gridRow = Math.floor(index / options.numCols);
        bubble.style.zIndex = gridRow + (newScale > 1 ? 100 : 1);
      };

      let startDistance = 0;
      const getDistance = (touches) =>
        Math.hypot(
          touches[0].pageX - touches[1].pageX,
          touches[0].pageY - touches[1].pageY
        );

      const handleTouchStart = (e) => {
        console.log("touching",e.touches)
        if (e.touches.length === 2) {
          startDistance = getDistance(e.touches);
        }
      };

      const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
          const newDistance = getDistance(e.touches);
          let zoomFactor = newDistance / startDistance;
          let newScale = bubbleScale * zoomFactor;
          newScale = Math.min(Math.max(0.5, newScale), 2);

          setScales((prevScales) => ({
            ...prevScales,
            [bubbleId]: newScale,
          }));
          bubbleScale = newScale;
          startDistance = newDistance;

          const gridRow = Math.floor(index / options.numCols);
          bubble.style.zIndex = gridRow + (newScale > 1 ? 100 : 1);
        }
      };

      bubble.addEventListener("wheel", handleWheel);
      bubble.addEventListener("touchstart", handleTouchStart);
      bubble.addEventListener("touchmove", handleTouchMove);

      return () => {
        bubble.removeEventListener("wheel", handleWheel);
        bubble.removeEventListener("touchstart", handleTouchStart);
        bubble.removeEventListener("touchmove", handleTouchMove);
      };
    });
  }, [scales]);

  const handleClick = useCallback((bub) => {
    setBubble(bub);
  }, []);

  const children = data?.map((data, i) => {
    const scaleStyle = {
      transform: `scale(${scales[i] || 1})`,
      transition: "transform 0.2s ease", // Smooth scaling transition
      zIndex: Math.floor(i / options.numCols) + (scales[i] > 1 ? 100 : 1), // Adjust z-index based on row position
    };

    return (
      <div className="bubble-container" key={i} style={scaleStyle}>
        <Child data={data} setClick={handleClick} />
      </div>
    );
  });

  return (
    <>
      <BubbleUI key={1} options={options} className="myBubbleUI">
        {children}
      </BubbleUI>
      <div style={{ marginTop: 50 }}>Clicked bubble: {bubble}</div>
    </>
  );
}
