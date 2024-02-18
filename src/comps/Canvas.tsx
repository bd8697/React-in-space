import React, { Fragment, useEffect, useRef, useState } from "react";
import { Player } from "./Player";
import { Planet } from "./Planet";
import { useAppSelector } from "../hooks/UniversalHook";
import classes from "./Canvas.module.css";
import { Background } from "./Background";
import { AudioPlayer } from "./AudioPlayer";
import { UI } from "./UI/UI";
import useSound from "use-sound";
import spaceSound from '../audios/effects/space.wav'
import {global} from '../utility/Utility'
import PlanetType from '../entities/Planet'

export const Canvas = () => {
  const [playMenuSound, {sound: menuSound, stop: stopMenuSound}] = useSound(spaceSound);
  const gameOver = useAppSelector((state) => state.gameOver);
  const showUI = useAppSelector((state) => state.showUI);
  const [planets, setPlanets] = useState<PlanetType[]>([])
  const colorValue = useRef(0)
  const isPlayerResizing = useRef(() => {return false}) //we need this to call a method in sibling1 from sibling 2. This is bad practice because it requires the existance of sibling1 for sibling2 to function correctly. In this case, sibling2 will always have a sibling1, so, even though this is still not recommended, it's ok to break the rules sometimes.

  const onNewAudio = (idx: number, stereo: number) => { // and this would be the right way to handle events triggered in children, if I got it right
    if(planets.length < global.maxPlanets) {
      onAddPlanet(idx, stereo);
    }
  };

  const onAddPlanet = (idx: number, stereo: number) => {
    const id: string = Date.now().toString();
    setPlanets((planets) => planets.concat(new PlanetType(+id,idx,stereo)))
    if(colorValue.current < global.maxColorValue) {
      colorValue.current += 0.5;
    }
  };

  const destroyPlanet = (id: number) => {
    setPlanets((planets) => planets.filter(planet => planet.id !== id)) 
  };

  useEffect(() => {
    if(menuSound) {
      menuSound._loop = true
      menuSound._volume = 0.25
    }
    if(gameOver) { 
      playMenuSound()
      colorValue.current = 0
    } 
    else if(!gameOver) {
      setPlanets([])
      stopMenuSound()
    }
  }, [gameOver, menuSound, playMenuSound, stopMenuSound])

  return (
    <div className={classes.canvas}>
      <Background colorValue={colorValue.current}></Background>
      {showUI && <UI></UI>}
      <div className={classes.content}>
        {!gameOver && <AudioPlayer onNewAudio={onNewAudio}></AudioPlayer>}
        {!gameOver && <Player isPlayerResizing = {isPlayerResizing}></Player>}
        {planets.map((planet) => (
          <Planet
            isPlayerResizing = {isPlayerResizing}
            key={planet.id}
            planet={planet}
            destroyPlanet={destroyPlanet}
          ></Planet>
        ))}

      </div>
    </div>
  );
};
