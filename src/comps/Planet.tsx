import React, { FC, useEffect, useRef } from "react";
import universalStore, { endGame } from "../store/UniversalStore";
import PlanetType from "./../entities/Planet";
import { useState } from "react";
import { random, randomInt, getWindowDimensions, getAsPercOf, getFirstNumberInString } from "../utility/Utility";
import classes from "./Planet.module.css";
import yellow_planet from "../imgs/planets/yellow_planet.png";
import green_planet from "../imgs/planets/green_planet.png";
import red_planet from "../imgs/planets/red_planet.png";
import brown_planet from "../imgs/planets/brown_planet.png";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useAppSelector } from "../hooks/UniversalHook";
import whoosh from "../audios/effects/whoosh.wav"
import useSound from "use-sound";
import { global } from "../utility/Utility";
import { randomArgs } from './../utility/Utility';

const skins = [
  green_planet,
  yellow_planet,
  red_planet,
  brown_planet
];

export const Planet: FC<{
  planet: PlanetType;
  destroyPlanet: (id: number) => void;
  isPlayerResizing: { current: () => boolean; };
}> = (props) => {

  const [gameOverSound] = useSound(whoosh, {playBackRate: 0.5});
  const hitBox = useRef<HTMLDivElement>(null)
  const planetDiv = useRef<HTMLDivElement>(null)
  const playerPos = useRef(universalStore.getState().playerPos)
  const playerSize = useAppSelector((state) => state.playerSize)
  const isGameOver = useAppSelector((state) => state.gameOver)
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
 
  const springConfig = { damping:  1, stiffness: 3 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

const [view, setView] = useState(getWindowDimensions());

const initSizeScale = () => {
  if(random(0,1000) < 1) {
    return 3
  }
  return random(1,2)
}
const [sizeScale, setSizeScale] = useState(initSizeScale())

const initSize = () => {
  let perc = 0
  switch (props.planet.skinIdx) {
    case 0: {
      perc = 25
      break;
    }
    case 1:{
      perc = 2.5
      break;
    }
    case 2:{
      perc = 20
      break;
    }
    case 3:{
      perc = 25
      break;
    }
  }
  let size = getAsPercOf(perc * sizeScale, view.height);
  return size;
}
const [size, setSize] = useState(initSize());

  const initPos = () => {
    let x = getAsPercOf(random(-50, 50), view.width);
    let y = getAsPercOf(random(-50, 50), view.height);
    if(Math.abs(props.planet.stereo) > 1) {
        let sign = Math.sign(props.planet.stereo)
        x = view.width / 2 + size / 2;
        x *= sign
      }
    else  {
        x = getAsPercOf(props.planet.stereo * 50, view.width);

        let sign = Math.sign(randomArgs([-1, 1]))
        y = view.height / 2 + size / 2;
        y *= sign
      }
    return { x, y };
  };

  const setPlanetUp = (idx: number) => {
    switch (idx) {
      case 0: {
        return {
          animate: {
            x: -2 * position.x,
            y: -2 * position.y,
            rotate: random(90, 180),
          },
          transition: { ease: "easeIn", duration: 2.5 * sizeScale },
        };
      }
      case 1: {
        let animatePos = {}
        let duration = 2.5 * sizeScale
        let coordsTransition = { ease: [0.75,0,0.25,1], duration: duration }
        let scaleTransition = {ease: [0.25,0,0.75,1], duration: duration}
        if (position.x < -view.width / 2 || position.x > view.width / 2) {
          animatePos = {x: -2 * position.x}
        }
        if (position.y < -view.height / 2 || position.y > view.height / 2) {
          animatePos = {y: -2 * position.y}
        }
        return {
          animate: {
            ...animatePos,
            scale: [1,10,1],
          },
          transition: {x: coordsTransition, y: coordsTransition, scale: scaleTransition},
        };
      }
      case 2: {   
        let duration = 5 * sizeScale  
        return {
        initial: {
          rotate: 0,
          opacity: 1
        },
        animate: {
          rotate: 360 * 2 * duration,
          opacity: [1,1,0] // the "correct" way is to use an exit animation, but because of the way this component unmouts, it will cause more problems than it solves
        },
        transition:{rotate: { ease: "easeOut", duration }, opacity: {ease: "easeInOut", duration, times: [0, 0.86, 1] }},
        homingStyle: {
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }
      };}
      case 3: {
        const spinDirection = Math.sign(position.x)
        let edgeOnLength = 0;
        let minRadius = 25
        let maxRadius = 0
        let initSpin = 0
        let finalSpin = 0
        if (position.x < -view.width / 2 || position.x > view.width / 2) {
          maxRadius = 50 + Math.abs(position.y) / view.height // the bigger the radius, the better
          edgeOnLength = view.height
          if (position.y < 0) {            
            initSpin = 0 * spinDirection
            finalSpin = 180 * spinDirection
          } else {
            initSpin = 180 * spinDirection
            finalSpin = 0 * spinDirection
          }
        }
        if (position.y < -view.height / 2 || position.y > view.height / 2) {
          maxRadius = 50 // radius being half the screen is enaugh
          edgeOnLength = view.width
          if (position.y < 0) {
            initSpin = 90 * spinDirection
            finalSpin = 90 * -spinDirection
          } else {
            initSpin = 90 * spinDirection
            finalSpin = 270 * spinDirection
          }
        }
        const radius = getAsPercOf(random(minRadius, maxRadius), edgeOnLength);

        return {
          initial: {
            rotate: initSpin
          },
          animate: {
            rotate: finalSpin,
          },
          transition: { ease: "easeIn", duration: 2 * sizeScale},
          boundsStyle: { top: radius },
          exit: {},
        };
      }
    }
  };

  const [position, setPosition] = useState(initPos());
  const [config, setConfig] = useState(setPlanetUp(props.planet.skinIdx));

  const [skin, setSkin] = useState(skins[props.planet.skinIdx]);

  const onResize = () => {
    setView(getWindowDimensions());
  };

  const gameOver = () => {
    if(!universalStore.getState().gameOver && !props.isPlayerResizing.current()) {
      universalStore.dispatch(endGame());
      gameOverSound()
    }
    // if(isGameOver === false) {
        // why is this always true, is Framer Motion's exit animation not updating the state???
        // same problem with rAf in Player. Vars gotten with useAppSelector are either broken or stupid. Either way, find a better solution(subscribe?)
    // }
  };

  const getPlanetScale = () => {
    const transform = window.getComputedStyle(planetDiv.current!).getPropertyValue("transform");
    return +getFirstNumberInString(transform);
  }

  const updatePlayerPos = () => {
    if(hitBox.current) {
      playerPos.current = universalStore.getState().playerPos
      const bounds = hitBox.current!.getBoundingClientRect();
      const center = Math.abs(bounds.right - bounds.left)
      const centerX = bounds.left + center / 2
      const centerY = bounds.top + center / 2
      let hitboxSize = size * global.planetHitboxMultiplier
        if(props.planet.skinIdx === 1) { //this will not work if the div rotates. If it does, the scale yoyos from -1 to 1.
          hitboxSize *= getPlanetScale()
        }
      if (
        playerPos.current.x > centerX - hitboxSize / 2 &&
        playerPos.current.x < centerX + hitboxSize / 2 &&
        playerPos.current.y > centerY - hitboxSize / 2 &&
        playerPos.current.y < centerY + hitboxSize / 2
      ) {
        gameOver()
      }
      cursorX.set((playerPos.current.x - playerSize / 2 - view.width / 2) - position.x);
      cursorY.set((playerPos.current.y - playerSize / 2 - view.height / 2) - position.y);
    }
  }

  useEffect(() => {
    const unsubscribe = universalStore.subscribe(updatePlayerPos)
    window.addEventListener("resize", onResize);
    return () =>  {window.removeEventListener("resize", onResize); unsubscribe();}
  }, []);

  const autoDestroy = () => {
    props.destroyPlanet(props.planet.id);
  };

  const pos = {
    top: position.y - size / 2,
    left: position.x - size / 2,
    width: size,
    height: size,
  };

  const boundsStyle = config?.boundsStyle;
  const homingStyle = config?.homingStyle;

  return (
    <AnimatePresence onExitComplete={autoDestroy}>
    {!isGameOver && <motion.div
      onAnimationComplete={autoDestroy}
      key={props.planet.id}
      initial={config!.initial}
      animate={config!.animate}
      transition={config!.transition}
      exit = {{opacity: 0, transition: {ease: "easeInOut", duration: 1}}}
      style={{...pos, ...homingStyle}}     
      className= {classes.planet}
      ref={planetDiv}
    >
      <div className={classes.bounds} style={boundsStyle}>
        <div className={classes.hitbox} ref={hitBox}> </div>
        <img alt="O" src={skin} className={classes.skin}></img>
      </div>
    </motion.div>}
    {/* <div style={{backgroundColor: "red", position: "fixed", top: poses.t, left: poses.l, width: "10px", height: "10px" }}></div> */}
    </AnimatePresence>
  );
};
