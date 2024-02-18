import { configureStore, createSlice } from "@reduxjs/toolkit";
import Planet from "../entities/Planet";
import {global} from '../utility/Utility'

const universeSlice = createSlice({
  name: "universe",
  initialState: {
    gameOver: true,
    showUI: true,
    playerSize: global.playerSize,
    score: 0,
    playerPos: {x:0, y: 0},
  },
  reducers: {
    setPlayerPos: (state, action) => {
      state.playerPos = action.payload.playerPos
    },
    addScore: (state, action) => {
      state.score += +action.payload.toAdd
    },
    endGame: (state) => {
        state.gameOver = true
        state.showUI = !state.showUI
    },
    switchUI: (state) => {
      state.showUI = !state.showUI
    },
    startGame: (state) => {
      state.playerPos = {x:0, y: 0}
      state.score = 0
      state.gameOver = false
  }
  },
});

export const {setPlayerPos, switchUI, addScore, endGame, startGame} = universeSlice.actions

const universalStore = configureStore( {
    reducer: universeSlice.reducer
})

export type UniversalState = ReturnType<typeof universalStore.getState>

export type UniversalDispatch = typeof universalStore.dispatch

export default universalStore