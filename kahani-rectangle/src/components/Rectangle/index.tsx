import React, { FC } from "react";
import { Rect } from "react-konva";
import { RectDef } from "../../interfaces/RectDef";
import useCursor from "../../hooks/useCursor";

interface RectangleViewProps {
  shape: RectDef,
  className: string,
}

const View: FC<RectangleViewProps> = ({ shape, ...props }) => (
  <Rect {...shape} {...props} />
);

interface RectangleProps {
  shape: RectDef,
}

const Rectangle: FC<RectangleProps> = (props) => {

  const {
    onMouseEnter,
    onMouseLeave
  } = useCursor();

  const hookProps = {
    onDragEnd: () => {
      // check within bounds
      // reposition if needed
      // save to store
    },
    onMouseEnter,
    onMouseLeave,
  }

  return (
    <View {...props} {...hookProps} />
  )
};

export default Rectangle;