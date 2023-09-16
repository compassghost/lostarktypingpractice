import {
  AppBar,
  Box,
  Button,
  Container,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TypingKeyboard } from './components/TypingKeyboard';
import vykas from './assets/vykas.mp4';
import seto from './assets/seto.jpg';

export const App = () => {
  const [showAppBar, setShowAppBar] = useState(true);
  const [thaemineMode, setThaemineMode] = useState(true);
  const [allowedKeys, setAllowedKeys] = useState('qweasd');

  const handleScroll = useCallback(() => {
    if (window.scrollY >= 25) {
      setShowAppBar(false);
    } else {
      setShowAppBar(true);
    }
  }, [setShowAppBar]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <BrowserRouter>
      <Slide appear={false} direction="down" in={showAppBar}>
        <AppBar
          sx={{
            background: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Toolbar sx={{ gap: 4 }}>
            <Typography variant="h5" noWrap>
              Lost Ark Typing Practice
            </Typography>
            <TextField
              label="Allowed keys pool"
              InputLabelProps={{
                sx: {
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
              inputProps={{
                sx: {
                  color: 'white',
                  background: 'rgba(255,255,255,0.5)',
                  padding: '5px',
                },
              }}
              type="text"
              value={allowedKeys}
              onChange={(e) => {
                setAllowedKeys(e.target.value);
              }}
            />
             <Button
              variant="contained"
              sx={{
                background: thaemineMode ? 'black' : 'crimson',
                '&:hover': {
                  background: thaemineMode ? 'black' : 'crimson',
                },
                '&:active': {
                  background: thaemineMode ? 'black' : 'crimson',
                },
              }}
              onClick={() => {
                   setThaemineMode((prev) => !prev);
                   document.getElementById('background-video')!.style.display = thaemineMode ? 'none' : 'inline';
                }
              }
            >
              {thaemineMode ? 'Thaemine Mode' : 'Vykas Mode'}
            </Button>
          </Toolbar>
        </AppBar>
      </Slide>

     <video id="background-video" autoPlay loop muted>
        <source src={vykas} type='video/mp4'/>
      </video>
      
		<Container
	sx={{
          pt: 32,
          pb: 2,
          height: '100%',
          minHeight: '100vh',
          minWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
		<TypingKeyboard allowedKeys={allowedKeys} thaemineMode={thaemineMode} />
		</Container>
    </BrowserRouter>
  );
};
