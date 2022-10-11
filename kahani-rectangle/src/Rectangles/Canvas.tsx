import React, { FC, MutableRefObject, useRef } from 'react';
import { useRectangles } from '../hooks/useRectangles.ts';
import "./Canvas.css";

interface ViewProps {
  create(): void,
  canvasRef: MutableRefObject<HTMLCanvasElement>
}

const View : FC<ViewProps> = ({ create, canvasRef, ...props }) => (
  <div className="canvasWrap">
    <button onClick={create}>Create Rectangle</button>
    <canvas ref={canvasRef} {...props} />
  </div>
);

const Canvas : FC = () => {

  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;

  const { createRectangle } = useRectangles();

  const hookProps = {
    create: () => createRectangle(canvasRef.current),
  };
  
  return (
    <View canvasRef={canvasRef} {...hookProps} />
  );
};

export default Canvas;