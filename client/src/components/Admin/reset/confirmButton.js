import React from 'react';

import {
    Button,
    Box,
    Dialog, DialogTitle, DialogActions,
    Snackbar
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function ConfirmButton(props) {
    const [open, setOpen ] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const { buttonText, confirmation, success, action } = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if (value) action();
        setOpenAlert(value);
    };

    const handleAlertClose = () => {
        setOpenAlert(false);
    }

    return(
        <Box mt={2} mb={1} textAlign="right">
            <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleClickOpen}
                size="small"
            >
                {buttonText}
            </Button>
            <SimpleDialog open={open} onClose={handleClose} confirmation={confirmation} />
            <Snackbar onClose={handleAlertClose} open={openAlert} autoHideDuration={6000}>
                <Alert severity="success" onClose={handleAlertClose}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function SimpleDialog(props) {
    const { onClose, open, confirmation } = props;
  
    const handleClose = (value) => {
      onClose(value);
    };
  
    return (
      <Dialog onClose={() => handleClose(false)} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">{confirmation}</DialogTitle>
        <DialogActions>
            <Button
                variant="contained"
                color="secondary"
                type="submit"
                onClick={() => handleClose(true)}
                size="large"
            >
                YES
            </Button>
            <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={() => handleClose(false)}
                size="large"
            >
                NO
            </Button>
        </DialogActions>
      </Dialog>
    );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default ConfirmButton;