import React, { FC, useCallback, useRef, useState } from "react";
import classes from "./Player.module.css";
import cyan_planet from "../imgs/planets/cyan_planet.png";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useAppSelector } from "../hooks/UniversalHook";
import universalStore, { setPlayerPos } from "../store/UniversalStore";
import { getFirstNumberInString } from "../utility/Utility";
import {global} from '../utility/Utility'

const animationVariants = {
  whileTap: {
    scale: 0,
    transition: { ease: "easeInOut", duration: global.playerImunityDownDuration },
  },
  whileTapExit: {
    scale: 1,
    transition: { ease: "easeInOut", duration: global.playerImunityDownDuration / 2},
  }
}

export const Player = (props: {
  isPlayerResizing: { current: () => boolean };
}) => {
  const [whileTap, setWhileTap] = useState(animationVariants.whileTap)
  const playerSize = useAppSelector((state) => state.playerSize);
  const offSetPlayerPos = (playerSize * global.playerHitboxMultiplier) / 2;
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const playerScale = useRef<HTMLDivElement>(null);
  const thisFrameRef = useRef(0);
  const autoEndImmunityTimeout = useRef<ReturnType<typeof setTimeout>>()

  const springConfig = { damping: 100, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const onCursorMove = (e: MouseEvent) => {
    cursorX.set(e.clientX - offSetPlayerPos);
    cursorY.set(e.clientY - offSetPlayerPos);
  };

  const logPlayerPos = () => { // we need this cause, by using spring animations, the player pos updates even after the cursor stopped moving, so 'onmousemove" doesn't trigger. We can't use an useEffect() with the new pos as a dependency, because that isn't stateful, so it won't trigger a re-render either.
    let pos = {x: cursorXSpring.get() + offSetPlayerPos, y: cursorYSpring.get() + offSetPlayerPos}
    universalStore.dispatch(setPlayerPos({playerPos: pos}))
    if(!universalStore.getState().gameOver) {
      thisFrameRef.current = requestAnimationFrame(logPlayerPos); // calls itself every render (without re-rendering the component)
    }    
  }

  useEffect(() => {
    thisFrameRef.current = requestAnimationFrame(logPlayerPos);
    return (() => cancelAnimationFrame(thisFrameRef.current))
  }, []); 

useEffect(() => {
    window.addEventListener("mousemove", onCursorMove);
    return () => {
      window.removeEventListener("mousemove", onCursorMove);
    };
  }, []);

  const playerBoxStyle = {
    // so we want to trigger "whileTap" on the iamge, no matter where you click. That's not possible (?), so we instead detect clicks and handle them on a parent div, that will cover the whole* screen.
    top: 0,
    left: 0,
    width: playerSize * global.playerHitboxMultiplier,
    height: playerSize * global.playerHitboxMultiplier,
    translateX: cursorXSpring,
    translateY: cursorYSpring,
  };

  const onTapStart = (e: MouseEvent) => {
    e.preventDefault();
    autoEndImmunityTimeout.current = setTimeout(() => { // if the player is a coward and choses to stay immune by not letting go of the left click, help him.
      setWhileTap(animationVariants.whileTapExit)
  }, global.playerImunityDownDuration * 1000)
}

  const onTapEnd = () => {
    clearTimeout(autoEndImmunityTimeout.current!)
    setWhileTap(animationVariants.whileTap)
  }

  const isResizing = useCallback(() => {
    const transform = window
      .getComputedStyle(playerScale.current!)
      .getPropertyValue("transform");
    // transform's form: "matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())"
    const scale = getFirstNumberInString(transform);
    // is this really not doable with framer motion?, cause this is just ugly...
    if (+scale === 1) {
      return false;
    }
    return true;
  }, [playerSize]);

  useEffect(() => {
    props.isPlayerResizing.current = isResizing;
  }, []);

  return (
    <motion.div
      ref={playerScale}
      className={classes.playerContainer}
      initial={{ scale: 1 }}
      onTapStart={onTapStart}
      onTap={onTapEnd}
      onTapCancel={onTapEnd}
      animate={animationVariants.whileTapExit} // exit animation for whileTap
      whileTap={whileTap}
      style={{ ...playerBoxStyle }}
    >
      <motion.img
        initial={{ rotate: 0, scale: 0 }}
        animate={{
          rotate: 360,
          scale: 1,
          transition: {
            rotate: { ease: "linear", duration: 10, repeat: Infinity },
            scale: { ease: "easeInOut", duration: 3 },
          },
        }}
        alt="O"
        src={cyan_planet}
        style={{ maxWidth: playerSize }}
      ></motion.img>
    </motion.div>
  );
};
