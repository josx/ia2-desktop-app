import React, { ReactNode, useEffect, useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { version } from '../constants/misc';

const Version = ({ ver }) => (
  <Typography
    style={{
      position: 'absolute',
      bottom: '15px',
      right: '8px',
      color: '#6c757d',
      cursor: 'default',
    }}
  >
    {`v${ver}`}
  </Typography>
);

Version.propTypes = {
  ver: PropTypes.string.isRequired,
};

const DownloadDialog = () => {
  const [open, setOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [available, setAvailable] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRestart = () => {
    ipcRenderer.send('restart_app');
    handleClose();
  };

  useEffect(() => {
    ipcRenderer.on('update_available', () => {
      setAvailable(true);
      setOpen(true);
    });
    ipcRenderer.on('update_downloaded', () => {
      setAvailable(false);
      setDownloaded(true);
    });
    return () => {
      ipcRenderer.removeAllListeners(['update_available', 'update_downloaded']);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {available ? <LinearProgress /> : null}
      <DialogTitle id="responsive-dialog-title">
        Actualización de aplicación...
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {available
            ? 'Hay disponible una nueva versión de la aplicación, empezando descarga.'
            : null}
          {downloaded
            ? 'La descarga se ha completado. Para utilizar debe reiniciar la aplicación.'
            : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
        {downloaded ? (
          <Button onClick={handleRestart} color="primary" autoFocus>
            Reiniciar
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
};

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const theme = createMuiTheme({
    palette: {
      common: {
        white: '#ffffff',
      },
      primary: {
        main: '#00D6A1',
        light: '#FF7A68',
        dark: '#1F3366',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#1F3366',
        light: '#FFCA00',
        dark: '#00D6A1',
        contrastText: '#ffffff',
      },
      background: {
        default: '#1F3366',
      },
    },
    typography: {
      fontFamily: `Saira-Regular`,
    },
    overrides: {
      MuiStepLabel: {
        label: {
          '&$active': {
            color: '#1F3366',
            fontWeight: 800,
            fontSize: '1.2em',
          },
        },
      },
    },
  });

  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      {children}
      <Version ver={version} />
      <DownloadDialog />
    </ThemeProvider>
  );
}
