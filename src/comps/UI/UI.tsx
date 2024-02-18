import React from 'react'
import { PlayBtn } from './PlayBtn'
import { Score } from './Score'
import classes from './UI.module.css'

export const UI = () => {
    return (
        <div className={classes.UI}>
            <Score></Score>
            <PlayBtn></PlayBtn>
        </div>
    )
}
