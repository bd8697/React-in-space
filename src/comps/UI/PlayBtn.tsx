import React, { useEffect, useState } from "react";
import classes from "./PlayBtn.module.css";
import { AnimatePresence, motion } from "framer-motion";
import universalStore, { startGame, switchUI } from "../../store/UniversalStore";
import { useAppSelector } from "../../hooks/UniversalHook";
import useSound from "use-sound";
import whoosh from "../../audios/effects/whoosh.wav";

const btnStyle = {
    translateX: '-50%',
    translateY: '-50%'
  };

export const PlayBtn = () => {

  const [playSound] = useSound(whoosh,{playbackRate: 2});

    const gameOver = useAppSelector((state) => state.gameOver)

    const onPlay = () => {
        playSound();
        universalStore.dispatch(startGame())
    }

    const onTrueUnmount = () => {
        universalStore.dispatch(switchUI())
    }
  return (
    <AnimatePresence onExitComplete= {onTrueUnmount}>
   {gameOver && <motion.button
      onClick={onPlay}
      className={classes.playButton}
      initial={{fontSize: "0em",}}
      animate={{fontSize: "3em", }}
      transition={{
        type: "spring",
        bounce: 0.37, //0.25 by default
        duration: 2,
      }}
      whileHover={{
        scale: 1.25,
        textShadow: "0px 0px 5px rgb(255, 255, 127)",
        boxShadow:  "0px 0px 25px rgb(255, 255, 127)",
        transition: {type: "spring", bounce: 0.5 },
      }}
      whileTap={{
        textShadow: "0px 0px 10px rgb(255, 255, 225)",
        boxShadow:  "0px 0px 50px rgb(255, 255, 225)",
        color: "rgb(255, 255, 225)",
        borderColor: "rgb(255, 255, 225)",
        fontSize: "4em",
        transition: {ease:"easeOut", duration: 0.2 },
      }}
      exit = {{scale:0, transition : {ease: "easeInOut", duration: 2 }}}
      style = {{...btnStyle}}
    >
      Play
    </motion.button>}
    </AnimatePresence>
  );
};
