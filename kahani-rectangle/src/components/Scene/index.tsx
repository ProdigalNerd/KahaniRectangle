import React, { FC, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { RectDef } from '../../interfaces/RectDef';
import Rectangle from '../Rectangle';
import Button from '@mui/material/Button';
import './Scene.css';

interface SceneProps {
  shapes: Array<RectDef>,
  addRectangle(): void,
}

const View: FC<SceneProps> = ({ shapes, addRectangle }) => (
  <>
    <div className="controls">
      <Button onClick={addRectangle} variant="contained">Add Rectangle</Button>
    </div>
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {shapes.map((shape) => (
          <Rectangle key={shape.key} shape={shape} />
        ))}
      </Layer>
    </Stage>
  </>
);

const Scene: FC = () => {
  const [shapes, setShapes] = useState<RectDef[]>([]);
  const colors = ['blue', 'black', 'red', 'green', 'yellow'];

  const hookProps = {
    addRectangle: () => {
      setShapes([
        ...shapes,
        {
          key: shapes.length,
          x: 100,
          y: 100,
          width: 200,
          height: 100,
          fill: colors[Math.round(Math.random() * colors.length)],
          draggable: true,
        }
      ])
    },
  };

  return (
    <View shapes={shapes} {...hookProps} />
  );
};

export default Scene;