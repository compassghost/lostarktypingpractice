import { Box, Typography } from '@mui/material';
import { useRef, useCallback, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import keySound from '../assets/keysound.mp3';
import failSound from '../assets/failsound.mp3';
import winSound from '../assets/winsound.mp3';
import Star from '../assets/star.png';
import css from './TypingKeyboard.module.scss';
import classNames from 'classnames';

const classes = classNames.bind(css);

export interface Score {
  time: number;
  success: boolean;
  window: number;
}

export const TypingKeyboard: React.FC<{ allowedKeys: string , thaemineMode: boolean}> = ({
  allowedKeys, thaemineMode, 
}) => {
  const [timer, setTimer] = useState(Date.now());
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const [sameRound, setSameRound] = useState(false);
  const [keys, setKeys] = useState<string>('');
  const [startedTime, setStartedTime] = useState(Date.now());
  const [scores, setScores] = useState<Score[]>([]);
  const [failedKeys, setFailedKeys] = useState<number[]>([]);
  const countdownRef = useRef<Countdown>(null);
  const timerRef = useRef(timer);
  const sameRoundRef = useRef(sameRound);
  const thaemineTimer = 5;
  const vykasTimer = 4;
  
  function getTimeWindow() {
    return thaemineMode ? vykasTimer : thaemineTimer;
  }

  useEffect(() => {
    if (scores.length > 10) {
      setScores((prev) => {
        const newScores = [...prev];
        newScores.shift();
        return newScores;
      });
    }
  }, [scores]);
  
  useEffect(() => {
    sameRoundRef.current = sameRound
  }, [sameRound]);
  



  const resetGame = useCallback(() => {
    if (!allowedKeys || allowedKeys.length === 0) return;
    let newKeys = '';
    for (let i = 0; i < (thaemineMode ? 7 : 8); i++) {
      newKeys += allowedKeys[Math.floor(Math.random() * allowedKeys.length)];
    }
    
    console.log(sameRoundRef.current);

    if(!sameRoundRef.current) {
        setStartedTime(Date.now());
        setTimer(Date.now() + getTimeWindow() * 1000);
        countdownRef!.current!.getApi().start();
    }

    setCurrentKeyIndex(0);
    setKeys(newKeys);
    setFailedKeys([]);
  }, [setCurrentKeyIndex, setKeys, setStartedTime, setFailedKeys, allowedKeys, thaemineMode]);

  useEffect(() => {
    setSameRound(false);
    resetGame();
  }, [thaemineMode, allowedKeys, resetGame]);
  
  
  
  useEffect(() => {
    const handleKeyTyped = (e: KeyboardEvent) => {
      setSameRound(true);
      if (!allowedKeys.split('').includes(e.key.toLowerCase())) {
        return;
      }
      
      if ((e.target as any)?.type === 'text') return;
      if (currentKeyIndex > keys.length - 1) return;
      if (failedKeys.length > 0) return;
      if (e.key.toLowerCase() === keys[currentKeyIndex].toLowerCase()) {
        setCurrentKeyIndex((prev) => prev + 1);
        if (currentKeyIndex < keys.length - 1) {
          const keySoundFx = new Audio(keySound);
          keySoundFx.playbackRate = 2;
          keySoundFx.play();
        } else {
          const winSoundFx = new Audio(winSound);
          winSoundFx.playbackRate = 1.1;
          winSoundFx.play();
          countdownRef!.current!.getApi().pause();
          setShowSuccessText(true);
          
          setSameRound(false);
          setTimeout(() => setShowSuccessText(false), 1000);
        }
      } else {
        const failSoundFx = new Audio(failSound);
        failSoundFx.playbackRate = 1;
        failSoundFx.play()
        setFailedKeys([...failedKeys, currentKeyIndex]);
        setScores((prev) => {
          return [
            ...prev,
            {
              time: Date.now() - startedTime,
              success: false,
              window: getTimeWindow()
            },
          ];
        });
        setTimeout(() => {
          resetGame();
        }, 1000);
        return;
      }

      if (currentKeyIndex === keys.length - 1) {
        setScores((prev) => {
          return [
            ...prev,
            {
              time: Date.now() - startedTime,
              success: true,
              window: getTimeWindow()
            },
          ];
        });
        setTimeout(() => {
          resetGame();
        }, 1500);
      }
    };

    window.addEventListener('keydown', handleKeyTyped);
    return () => window.removeEventListener('keydown', handleKeyTyped);
  }, [setTimer, setSameRound, currentKeyIndex, failedKeys, keys, startedTime, allowedKeys, thaemineMode, resetGame]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          gap: '6ffpx',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: thaemineMode ? 'row' : 'row-reverse', gap: '6px', transform: thaemineMode ? undefined: 'rotateX(180deg)'}} marginTop={40}>
          {keys.split('').map((key, ix) => {
            return (
              <Box
                key={ix}
                className={classes({
                  [css.shakeAnimation]: failedKeys.includes(ix),
                })}
                sx={{ position: 'relative',}}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '45px',
                    height: '45px',
                    backgroundColor: failedKeys.includes(ix)
                      ? 'rgba(225, 15, 15, 1)'
                      : 'rgba(170, 170, 170, 1)',
                    opacity: currentKeyIndex <= ix ? 1 : 0.5,
                    borderRadius: '6px',
                    boxShadow:
                      currentKeyIndex === ix && !failedKeys.includes(ix)
                        ? '-1px 4px 25px -3px #e1dbb6'
                        : '-1px 4px 15px -3px rgba(0,0,0,0.43)',
                    transform:
                      currentKeyIndex === ix ? (thaemineMode ? 'translateY(-8px)' : 'translateY(8px)') : undefined,
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-3px',
                      width: '45px',
                      height: '45px',
                      transform: thaemineMode ? undefined: 'rotateY(180deg)',
                      backgroundColor: failedKeys.includes(ix)
                        ? 'rgba(255, 50, 50, 1)'
                        : currentKeyIndex === ix
                        ? '#e1dbb6'
                        : 'rgba(200, 200, 200, 1)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '30px',
                    }}
                  >
                    {key.toUpperCase()}
                  </Box>
                </div>
                {ix < currentKeyIndex && (
                  <Box
                    className={classes(css.starAnimation)}
                    sx={{
                      position: 'absolute',
                      top: '-2px',
                    }}
                  >
                    <img src={Star} width="100%" />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
        {showSuccessText && (
          <Typography
            variant="h6"
            className={classes(css.successAnimation)}
            sx={{
              textAlign: 'center',
              position: 'absolute',
              top: '-135px',
              left: '-100px',
              right: '-100px',
              fontSize: '78px',
              fontWeight: 'bold',
              WebkitTextStroke: '2px rgba(111, 209, 255, 0.7)',
              WebkitTextFillColor: '#FFFFFF',
              textShadow:
                '0 0 7px rgba(111, 209, 255, 0.7), 0 0 10px rgba(111, 209, 255, 0.7),0 0 21px rgba(111, 209, 255, 0.7),0 0 42px rgba(111, 209, 255, 0.7),0 0 82px rgba(111, 209, 255, 0.7),0 0 92px rgba(111, 209, 255, 0.7),0 0 102px rgba(111, 209, 255, 0.7),0 0 151px rgba(111, 209, 255, 0.7)',
            }}
          >
            Success
          </Typography>
        )}

        <Box
          textAlign="center"
          marginTop={1}
          sx={{ background: 'rgba(255,255,255,0.5)', borderRadius: '10px' }}
        >
            <Countdown 
                ref={countdownRef}
                date={timer} 
                renderer={props => 
                
                             <div style={{borderRadius: '10px', 
                                          height: '18px',
                                          display: 'block',
                                          width: '100%',
                                          background: 'black',
                             
                             }}>
                             
                             
                             
                             <div style={{
                                       position: 'relative',
                                       top: '1px',
                                       left: '1px',
                                       borderRadius: '10px', 
                                       background: props.total/1000 > 1 ? 'cornflowerblue' : 'red',
                                       height: '16px', 
                                       display: 'block', 
                                       width: props.total/(thaemineMode ? 40 : 50) + '%',

                                       }}>
                                       </div>

                             <div style={{
                                       position: 'relative',
                                       top: '-19px',
                                       left: '1px',
                                       borderRadius: '10px', 
                                       height: '16px', 
                                       display: 'block', 
                                       width: '100%',
                                       color: props.total/1000 > 0 ? 'white' : 'red',
                                       }}>
                                       
                                       {Math.round(props.total/100)/10}
                                       </div>

                                       
                                       </div>
                                       }
                intervalDelay={10}
                precision={3}
                overtime={true}
                
                
                />
          <Typography variant="h6">
            {scores.length > 0 &&
              `Average time: ${(
                scores
                  .filter((s) => s.success)
                  .reduce(
                    (acc, cur, ix, arr) => cur.time / arr.length + acc,
                    0,
                  ) / 1000
              ).toFixed(2)}s`}
          </Typography>
          {scores.map((score, ix) => {
            return (
              <Typography
                key={ix}
                sx={{ color: score.success ? (score.time / 1000) > score.window ? 'yellow' : 'green' :'red' }}
              >
                {(score.time / 1000).toFixed(2)}s
              </Typography>
            );
          })}
        </Box>
      </Box>
    </>
  );
};
