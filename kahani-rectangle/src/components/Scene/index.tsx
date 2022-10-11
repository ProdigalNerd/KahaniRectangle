import React, { FC, useEffect, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

type RectDef = {
  key: number,
  x: number,
  y: number,
  fill: string,
  width: number,
  height: number,
  draggable: boolean,
  onDragend(): void,
}

interface SceneProps {
  shapes: Array<RectDef>
}

const View: FC<SceneProps> = ({ shapes }) => (
  <Stage width={window.innerWidth} height={window.innerHeight}>
    <Layer>
      {shapes.map((shape) => (
        <Rect {...shape} />
      ))}
    </Layer>
  </Stage>
);

const Scene: FC = () => {
  const [shapes, setShapes] = useState<RectDef[]>([]);
  const colors = ['blue', 'black', 'red', 'green', 'yellow'];
  console.log('hit');

  useEffect(() => {
    setShapes([
      {
        key: 0,
        x: 100,
        y: 100,
        width: 200,
        height: 100,
        fill: colors[0],
        draggable: true,
        onDragend: () => {}
      } as RectDef
    ]);
    /* eslint-disable-next-line */
  }, [setShapes]);

  return (
    <View shapes={shapes} />
  );
};

export default Scene;