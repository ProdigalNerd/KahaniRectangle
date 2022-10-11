import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import { Stage, Layer } from 'react-konva';
import { RectDef } from '../../interfaces/RectDef';
import Rectangle from '../Rectangle';
import Button from '@mui/material/Button';
import COLORS from '../../const/colors';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import './Scene.css';

interface SceneProps {
  shapes: Array<RectDef>,
  addRectangle(): void,
  onSelect(id: number): void,
  selectedRect: number|null,
  checkDeselect(e: any): void,
  clearRectangles(): void,
  removeRectangle(id: string): void,
  onChange(shape: RectDef): void,
  saveLayout(): void,
  openSave: boolean,
  closeSave(): void,
  onSave(): void,
  layoutName: string,
  setLayoutName: Dispatch<SetStateAction<string>>,
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
  saveLayout,
  openSave,
  closeSave,
  onSave,
  layoutName,
  setLayoutName,
  setShowSavedLayouts,
  showSavedLayouts,
  openSavedLayoutsDialog,
  savedLayouts,
  openLayout,
  deleteLayout,
}) => (
  <>
    <div className="controls">
      <Button onClick={addRectangle} variant="contained">Add Rectangle</Button>
      <Button onClick={saveLayout} variant="contained">Save Layout</Button>
      <Button onClick={openSavedLayoutsDialog} variant="contained">View Layouts</Button>
      <Button onClick={clearRectangles} variant="outlined">Clear</Button>
    </div>
    <Dialog open={openSave}>
      <DialogTitle>Save Layout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To save this layout, enter a name below and click save.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Layout Name"
            type="text"
            fullWidth
            variant="standard"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSave}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogActions>
    </Dialog>

    <Dialog onClose={() => setShowSavedLayouts(false)} open={showSavedLayouts}>
      <DialogTitle>Select A Layout</DialogTitle>
      <List sx={{ pt: 0 }}>
        {savedLayouts.map((layout) => (
          <ListItem
            key={layout}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteLayout(layout)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText onClick={() => openLayout(layout)} primary={layout} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={() => setShowSavedLayouts(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>

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
  const [savedLayouts, setSavedLayouts] = useState([] as string[]);
  const [showSavedLayouts, setShowSavedLayouts] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [selectedRect, setSelectedRect] = useState(null);

  const hookProps = {
    addRectangle: () => {
      setShapes([
        ...shapes,
        {
          id: counter,
          key: counter,
          x: 100,
          y: 100,
          width: 200,
          height: 100,
          fill: COLORS[Math.floor(Math.random() * COLORS.length)],
          draggable: true,
        }
      ]);
      setCounter(counter + 1);
    },
    onSelect: (id) => {
      setSelectedRect(id);
    },
    onChange: (shape) => {
      let newShapes = [...shapes];
      const index = newShapes.findIndex((oldShape) => oldShape.id === shape.id);
      newShapes[index] = shape;
      setShapes(newShapes)
    },
    selectedRect,
    checkDeselect: (e) => {
      // deselect when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedRect(null);
      }
    },
    removeRectangle: (id) => {
      let newShapes = [...shapes];
      const index = newShapes.findIndex((oldShape) => oldShape.id === id);
      newShapes.splice(index, 1);
      setShapes(newShapes)
    },
    clearRectangles: () => setShapes([]),
    saveLayout: () => {
      setOpenSave(true);
    },
    closeSave: () => setOpenSave(false),
    openSave,
    onSave: () => {
      window.localStorage.setItem(layoutName, JSON.stringify(shapes));
      setLayoutName('');
      setOpenSave(false);
    },
    layoutName,
    setLayoutName,
    showSavedLayouts,
    setShowSavedLayouts,
    openSavedLayoutsDialog: () => {
      setSavedLayouts(Object.keys(localStorage));
      setShowSavedLayouts(true);
    },
    savedLayouts,
    openLayout: (selectedLayout) => {
      const layoutString = window.localStorage.getItem(selectedLayout);
      if (!layoutString) return;

      const layout = JSON.parse(layoutString) as RectDef[];
      setShapes(layout);
      setShowSavedLayouts(false);
    },
    deleteLayout: (layout) => {
      localStorage.removeItem(layout);

      if (Object.keys(localStorage).length === 0) setShowSavedLayouts(false);

      setSavedLayouts(Object.keys(localStorage));
    },
  };

  return (
    <View shapes={shapes} {...hookProps} />
  );
};

export default Scene;