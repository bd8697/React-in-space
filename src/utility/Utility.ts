export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomArgs = (arr : number[]) => {
  let rndIdx = randomInt(0, arr.length - 1)
  return arr[rndIdx]
}

export const mapValToRange = (
  val: number,
  from_in: number,
  from_out: number,
  to_in: number,
  to_out: number
) => {
  return ((to_out - to_in) / (from_out - from_in)) * (val - from_in) + to_in
};

export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  export const getAsPercOf = (perc: number, of: number) => {
    return (perc / 100) * of;
  };

  export const getFirstNumberInString = (toParse: string) => {
    let gettingNumber = false;
    let number = ""; // lol
    for (const c of toParse) {
      if ((c >= "0" && c <= "9") || c === ".") {
        gettingNumber = true;
        number = number.concat(c);
      } else {
        if (gettingNumber) return number;
      }
    }
    return number;
  };


export const global = {
    playerImunityDownDuration: 1,
    audios: 4,
    maxPlanets: 50,
    maxDeltaTime: 60 * 3,
    minTimeout: 1000,
    maxTimeout: 3000,
    scoreToAdd : 10,
    spawnRateMultiplier: {
        from: 1,
        to: 20,
      },
      playerHitboxMultiplier: 30,
      playerSize: 100,
      planetHitboxMultiplier: 50/100,
      maxColorValue: 127,
      audioSprite: { // all audios are stored in a single .wav, at the coordiantes specified in here
        0: [0, 333],
        1: [333, 333],
        2: [666, 124],
        3: [790, 1170]
      }
}

Object.freeze(global)

  