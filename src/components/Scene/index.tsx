import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import { Stage, Layer } from 'react-konva';
import { RectDef } from '../../interfaces/RectDef';
import Rectangle from '../Rectangle';
import Button from '@mui/material/Button';
import COLORS from '../../const/colors';

import SaveDialog from "../SaveDialog";
import LayoutsDialog from "../LayoutsDialog";

import './Scene.css';

interface SceneProps {
  shapes: Array<RectDef>,
  setShapes: Dispatch<SetStateAction<RectDef[]>>,
  addRectangle(): void,
  onSelect(id: number): void,
  selectedRect: number|null,
  checkDeselect(e: any): void,
  clearRectangles(): void,
  removeRectangle(id: string): void,
  onChange(shape: RectDef): void,
  setOpenSave: Dispatch<SetStateAction<boolean>>,
  openSave: boolean,
  closeSave(): void,
  showSavedLayouts: boolean,
  setShowSavedLayouts: Dispatch<SetStateAction<boolean>>,
  openSavedLayoutsDialog(): void,
  savedLayouts: string[],
  openLayout(selectedLayout: string): void,
  deleteLayout(layout: string): void,
}

const View: FC<SceneProps> = ({
  shapes,
  addRectangle,
  clearRectangles,
  removeRectangle,
  onSelect,
  onChange,
  checkDeselect,
  selectedRect,
  setOpenSave,
  openSave,
  setShowSavedLayouts,
  showSavedLayouts,
  setShapes,
}) => (
  <>
    <div className="controls">
      <Button onClick={addRectangle} variant="contained">Add Rectangle</Button>
      <Button onClick={() => setOpenSave(true)} variant="contained" disabled={shapes.length === 0}>Save Layout</Button>
      <Button onClick={() => setShowSavedLayouts(true)} variant="contained">View Layouts</Button>
      <Button onClick={clearRectangles} variant="outlined">Clear</Button>
    </div>

    <SaveDialog
      openSave={openSave}
      closeSave={() => setOpenSave(false)}
      shapes={shapes}
    />

    <LayoutsDialog
      showSavedLayouts={showSavedLayouts}
      setShowSavedLayouts={setShowSavedLayouts}
      setShapes={setShapes}
    />

    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {shapes.map((shape) => (
          <Rectangle
            key={shape.key}
            shape={shape}
            onSelect={onSelect}
            isSelected={shape.id === selectedRect}
            onChange={onChange}
            removeRectangle={removeRectangle}
          />
        ))}
      </Layer>
    </Stage>
  </>
);

const Scene: FC = () => {
  const [shapes, setShapes] = useState<RectDef[]>([]);
  const [counter, setCounter] = useState(0);
  const [openSave, setOpenSave] = useState(false);
  
  const [showSavedLayouts, setShowSavedLayouts] = useState(false);
  const [selectedRect, setSelectedRect] = useState(null);

  const hookProps = {
    addRectangle: () => {
      // create a default shape and add it to the state
      setShapes([
        ...shapes,
        {
          id: counter,
          key: counter,
          x: 100,
          y: 100,
          width: 200,
          height: 100,
          // pick a random color to help show there is variety
          fill: COLORS[Math.floor(Math.random() * COLORS.length)],
          draggable: true,
        }
      ]);
      // ID tracker ;) 
      setCounter(counter + 1);
    },
    onSelect: (id) => {
      // Select a rectangle to show transform tools and edit tools
      setSelectedRect(id);
    },
    checkDeselect: (e) => {
      // deselect when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedRect(null);
      }
    },
    onChange: (shape) => {
      // update the store with new shape object based on id
      let newShapes = [...shapes];
      const index = newShapes.findIndex((oldShape) => oldShape.id === shape.id);
      newShapes[index] = shape;
      setShapes(newShapes)
    },
    selectedRect,
    removeRectangle: (id) => {
      // remove a rectangle from the store
      let newShapes = [...shapes];
      const index = newShapes.findIndex((oldShape) => oldShape.id === id);
      newShapes.splice(index, 1);
      setShapes(newShapes)
    },
    // clear the scene
    clearRectangles: () => setShapes([]),
    // state actions
    openSave,
    setOpenSave,
    showSavedLayouts,
    setShowSavedLayouts,
    setShapes,
  };

  return (
    <View shapes={shapes} {...hookProps} />
  );
};

export default Scene;