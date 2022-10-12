import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const View = ({ openSave, layoutName, setLayoutName, closeSave, onSave, hasError }) => (
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
          error={hasError}
          helperText="Please enter a name"
          onChange={(e) => setLayoutName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeSave}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </DialogActions>
  </Dialog>
);

const SaveDialog = ({ closeSave, shapes, ...props }) => {
  const [layoutName, setLayoutName] = useState('');
  const [hasError, setHasError] = useState(false);

  const hookProps = {
    layoutName,
    setLayoutName,
    onSave: () => {
      if (!layoutName) {
        setHasError(true);
        return;
      }
      window.localStorage.setItem(layoutName, JSON.stringify(shapes));
      setLayoutName('');
      setHasError(false);
      closeSave();
    },
    closeSave,
    hasError,
  }

  return (
    <View 
      {...props}
      {...hookProps}
    />
  );
}

export default SaveDialog;