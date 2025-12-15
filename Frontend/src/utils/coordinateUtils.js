// Convert pixel position to percentage-based coordinates
export const toPercentCoords = ({
  elementX,
  elementY,
  elementWidth,
  elementHeight,
  pageRect,
}) => {
  return {
    xPercent: (elementX - pageRect.left) / pageRect.width,
    yPercent: (elementY - pageRect.top) / pageRect.height,
    widthPercent: elementWidth / pageRect.width,
    heightPercent: elementHeight / pageRect.height,
  };
};

// Convert percentage-based coordinates back to pixels
export const toPixelCoords = ({
  xPercent,
  yPercent,
  widthPercent,
  heightPercent,
  pageRect,
}) => {
  return {
    x: xPercent * pageRect.width,
    y: yPercent * pageRect.height,
    width: widthPercent * pageRect.width,
    height: heightPercent * pageRect.height,
  };
};
