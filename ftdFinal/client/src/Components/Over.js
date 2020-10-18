import React, { Component } from 'react'

export class Over extends Component {
    render() {
        return (
            <div>
                GAME OVER
                <br></br>
                <br></br>
                <button id="Restart">restart</button>
                <br></br>
                <br></br>
                <div id='gameOverHighscores'></div>
            </div>
        )
    }
}

export default Over