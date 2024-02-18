import React, { FC, Fragment, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import useSound from "use-sound";
import audios from "../audios/audios.wav";
import universalStore, {addScore} from "../store/UniversalStore";
import {random, mapValToRange, global, randomInt} from '../utility/Utility'

export const AudioPlayer: FC<{ onNewAudio: (idx: number, stereo: number) => void }> = (props) => {
  
  const startTime = useRef(new Date().getTime())
  const timeout = useRef(setTimeout(() => {}, 1))
  const [audioIdx, setAudioIdx] = useState(0);
  const [deltaTime, setDeltaTime] = useState(0);
  const [timeoutRange, setTimeoutRange] = useState({
    minTimeout: global.minTimeout,
    maxTimeout: global.maxTimeout
  });
  const [playSound, {sound}] = useSound(audios, {
    sprite: { // all audios are stored in a single .wav, at the coordiantes specified in here
      2: [0, 333],
      1: [333, 333],
      0: [666, 124],
      3: [790, 1170]
    },
  });

  const onNewAudio = () => {
    updateTimePassed();
    calcNewTimeoutRange();
    randomizeIdx();
  };
  
  useEffect(() => {
    let stereo = random(-2, 2)
    if(sound)
      sound._stereo = stereo
    playSound({id: audioIdx.toString()});
    addTheScore();
    props.onNewAudio(audioIdx, stereo)
  }, [audioIdx])

  const addTheScore = () => {
    universalStore.dispatch(addScore({toAdd: global.scoreToAdd}));
  }
  const calcNewTimeoutRange = () => {
    const timeoutMultiplier = mapValToRange(
      Math.min(deltaTime, global.maxDeltaTime),
      0,
      global.maxDeltaTime,
      global.spawnRateMultiplier.from,
      global.spawnRateMultiplier.to
    );
    console.log(timeoutRange.maxTimeout)
    setTimeoutRange({
      minTimeout: global.minTimeout / timeoutMultiplier,
      maxTimeout: global.maxTimeout / timeoutMultiplier,
    });
  };

  const updateTimePassed = () => {
    const timeNow = new Date().getTime()
    setDeltaTime((timeNow - startTime.current) / 1000);
  };

  const randomizeIdx = () => {
    const lastIdx = audioIdx;
    let newIdx = lastIdx;
    do {
      newIdx = randomInt(0, global.audios - 1);
    } while (newIdx === lastIdx);
    setAudioIdx(newIdx);
  };

  useEffect(() => {
    timeout.current = setTimeout(
      onNewAudio,
      random(timeoutRange.minTimeout, timeoutRange.maxTimeout)
    );
    return () => {clearTimeout(timeout.current); }
  }, [deltaTime, timeoutRange.maxTimeout, timeoutRange.minTimeout]);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if(document.hidden) {
        clearTimeout(timeout.current)
      }
      else {
        timeout.current = setTimeout(
          onNewAudio,
          random(timeoutRange.minTimeout, timeoutRange.maxTimeout)
        );
      }
  });

  }, [])

  return <Fragment></Fragment>;
};
