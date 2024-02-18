import { useAppSelector } from "../../hooks/UniversalHook";
import classes from "./Score.module.css";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const scoreStyle = {
  translateX: "-50%",
  translateY: "-50%",
};

const enterAnimation = {
  scale: 1,
  transition: {
    duration: 1,
  },
};

const blinkAnimation = {
  scale: 1,
  textShadow: "0px 0px 0px rgb(255, 255, 127)",
  transition: {
    yoyo: Infinity,
  },
};

export const Score = () => {
  const scoreEnter = useAnimation();
  const scoreBlink = useAnimation();
  const gameOver = useAppSelector((state) => state.gameOver);
  const score = useAppSelector((state) => state.score);

  const initAnim =
    score > 0
      ? { scale: 1.1, textShadow: "0px 0px 10px rgb(255, 255, 127)" }
      : { scale: 1, textShadow: "0px 0px 0px rgb(255, 255, 127)" };

  const scoreAnimation = async () => {
    await scoreEnter.start(enterAnimation);
    if (score > 0) {
      scoreBlink.start(blinkAnimation);
    }
  };

  useEffect(() => {
    scoreAnimation();
  }, []);

  useEffect(() => {
  if(gameOver === false) {
    scoreBlink.stop()
  }
  }, [gameOver])

  return (
    <AnimatePresence>
      {gameOver && (
        <motion.div
          className={classes.score}
          initial={{ scale: 0 }}
          animate={scoreEnter}
          exit={{ scale: 0, transition: { ease: "easeInOut", duration: 1.5 } }}
          style={{ ...scoreStyle }}
        >
          <motion.p
            className={classes.scoreText}
            initial={initAnim}
            animate={scoreBlink}
          >
            Score: {score}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
