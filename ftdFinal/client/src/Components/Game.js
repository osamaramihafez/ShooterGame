import React, { Component } from 'react'
// import * from "/public/controller.js"

export class Game extends Component {
    render() {
        return (
			<div>
					<h2 id="status">0 |0</h2>
				<canvas id="stage" width="800" height="600"> </canvas>
				<div id="main">
						<div id="inv">
								<img alt='' id='0'></img>
								<img alt='' id='1'></img>
								<img alt='' id='2'></img>
								<img alt='' id='3'></img>
								<img alt='' id='4'></img>
								<img alt='' id='5'></img>
								<img alt='' id='6'></img>
						</div>
						<div id="page-wrap">Score: <span id="score">0</span> Lives: <span id="life">1</span> <br></br> Weapon: <span id="weapon_name">None</span> <br></br> Ammo <span id="ammo_info">None</span></div>
				</div>
			</div>
        )
    }
}

export default Game
