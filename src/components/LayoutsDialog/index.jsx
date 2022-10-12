import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const View = ({
  setShowSavedLayouts,
  showSavedLayouts,
  savedLayouts,
  deleteLayout,
  openLayout
}) => (
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
            <ListItemText className="layoutItem" onClick={() => openLayout(layout)} primary={layout} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={() => setShowSavedLayouts(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
);

const LayoutsDialog = ({ setShowSavedLayouts, showSavedLayouts, setShapes, ...props }) => {
  const [savedLayouts, setSavedLayouts] = useState(Object.keys(localStorage));

  useEffect(() => {
    if (showSavedLayouts) {
      // whenever the dialog opens re-fetch from local storage to keep up to date
      setSavedLayouts(Object.keys(localStorage));
    }
  }, [showSavedLayouts])

  const hookProps = {
    savedLayouts,
    setShowSavedLayouts,
    showSavedLayouts,
    openLayout: (selectedLayout) => {
      // get the selected layout from local storage. if its null return
      const layoutString = window.localStorage.getItem(selectedLayout);
      if (!layoutString) return;

      // if a layout is found then load it into the scene and close the dialog
      const layout = JSON.parse(layoutString);
      setShapes(layout);
      setShowSavedLayouts(false);
    },
    deleteLayout: (layout) => {
      // remove the layout from localstorage
      localStorage.removeItem(layout);

      // if the dialog is empty then close it
      if (Object.keys(localStorage).length === 0) setShowSavedLayouts(false);

      setSavedLayouts(Object.keys(localStorage));
    },
  }

  return (
    <View 
      {...props}
      {...hookProps}
    />
  );
}

export default LayoutsDialog;