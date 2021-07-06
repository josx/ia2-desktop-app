import React, { ReactNode, useEffect, useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { version } from '../constants/misc';
import { ipcRenderer } from 'electron';

const Version = ({v1}) => (
  <Typography
    style={{
      position: 'absolute',
      bottom: '15px',
      right: '8px',
      color: '#6c757d',
      cursor: 'default',
    }}
  >
    {`v${v1}`}
  </Typography>
);

type Props = {
  children: ReactNode;
};

export default function App(props: Props) {
  const [state, setState] = useState(false);
  const [ver, setVer] = useState(version);
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

  useEffect(() => {
    ipcRenderer.on('update_available', () => setState(true) );
	return () => { ipcRenderer.removeAllListeners(['update_available']); };
  }, []);

  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      {children}
      {!state ? <Version v1={version} /> : <Version v1="upgrade"/> }
    </ThemeProvider>
  );
}
