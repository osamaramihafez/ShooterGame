stage=null;
view = null;
interval=null;
interval2 = null;
socket = null;
user = null;
is_mobile = false;
shoot_limiter=false;
var Keys = {
    up: -1,
    down: -1,
    left: -1,
    right: -1
};

moveMap = {'a':true,'s':true,'d':true,'w':true};

function setupGame(){
	var c = document.getElementById('stage');
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
	y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	
	if (x <= 800 && y <= 800){
		is_mobile = true;
		document.getElementById('body').style.position = "fixed";
		c.width = 393;
		c.height = 664;
		
		c.addEventListener('touchmove',fingerMoves);
		c.addEventListener('touchstart', touchStartHandler);
		c.addEventListener('touchend',touchEndHandler);
		document.addEventListener('mousedown', shotDirection);
	}else{
		document.addEventListener('keydown', moveByKeydown);
		document.addEventListener('keyup', moveByKeyup);
		document.addEventListener('mousemove', lookDirection);
		document.addEventListener('mousedown', shotDirection);
		
	}
	stage= new Stage(c);
	
	

	start_socket();

}

function start_socket(){
	socket = new WebSocket("ws://142.1.200.148:10045");
	socket.onopen = function (event) {
		console.log("connected");
	};
	socket.onclose = function (event) {
		alert("closed code:" + event.code + " reason:" +event.reason + " wasClean:"+event.wasClean);
	};
	socket.onmessage = function (event) {
		parse_socket(event.data);
	}
	
}

function fingerMoves(event){
	event.preventDefault();
	for(var i = 0; i<event.touches.length;i++){
		var dx = event.touches[i].pageX;
		var dy = event.touches[i].pageY;
		if(stage.JoyStick.in_range(dx,dy)){
			stage.JoyStick.update(stage.canvasposx + dx,stage.canvasposy + dy);
			stage.JoyStick.move();
		}
	}
}

function touchEndHandler(event){
	event.preventDefault();
	for(var i = 0; i<event.touches.length;i++){
		var dx = event.touches[i].pageX;
		var dy = event.touches[i].pageY;
		if(stage.JoyStick.in_range(dx,dy)){
			stage.JoyStick.realeased();
			stage.JoyStick.move();
			
		}
	}
}

function touchStartHandler(event){
	event.preventDefault();
	for(var i = 0; i<event.touches.length;i++){
		var dx = event.touches[i].pageX;
		var dy = event.touches[i].pageY;
		if(!stage.JoyStick.in_range(dx,dy)){
			stage.player.shoot(stage.canvasposx + dx,stage.canvasposy + dy);	
		}
	}
}

function startGame(){

	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
	
}
function pauseGame(){
	clearInterval(interval);
	clearInterval(interval2);
	interval=null;
	interval2=null;
}

function gameOver(){
	pauseGame();
	stage = null;
	socket.close();
	socket = null;
	$("#gameOver").show();
	$("#gameOver").children().show();
	$("#ui_game").children().hide();
	$("#ui_game").hide();
	document.removeEventListener('keydown', moveByKeydown);
	document.removeEventListener('keyup', moveByKeyup);
	document.removeEventListener('mousemove', lookDirection);
	document.removeEventListener('mousedown', shotDirection);
}

function restart(){
	stage=new Stage(document.getElementById('stage'));
	setupGame();startGame();
	$("#gameOver").children().hide();
	$("#gameOver").hide();
	$("#ui_game").show();
	$("#ui_game").children().show();
	var hash = "#";
	for (var i = '0'; i<'7'; i++){
		$(hash + i).attr('src', '');
	}
}

function moveByKeydown(event){
	var key = event.key;
	
	//Movement
	//Maybe change this to a switch statement?
	if(key == 'a') Keys.left = true;
	if(key == 's') Keys.down = true;
	if(key == 'd') Keys.right = true;
	if(key == 'w') Keys.up = true;
	if(key in moveMap){
		stage.player.move(Keys);
	}
	if(key == 'e') {
		var index = "#" + stage.player.pickup_item();
		$(index).attr('src', guns.pistol);
	};
	if(key == 'q') stage.player.drop_item();
	
	//Choosing Inventory
	// https://javascript.info/keyboard-events <- They checked for numbers with this if statement clause.
	if (key > '0' && key <= '7')stage.player.choose_inventory(key);

}


function moveByKeyup(event){
	var key = event.key;
	if(key == 'a') Keys.left = false;
	if(key == 's') Keys.down = false;
	if(key == 'd') {Keys.right = false;}
	if(key == 'w'){Keys.up = false;}
	if(key in moveMap){
		stage.player.move(Keys);
	}
}

function lookDirection(event){
	var dx = event.clientX - stage.canvas.offsetLeft + stage.canvasposx;
	var dy = event.clientY - stage.canvas.offsetTop + stage.canvasposy;
	
	if(stage.player != null){
		stage.player.direction(dx,dy);
	}

	stage.JoyStick.update(dx,dy);
}

function shotDirection(event){
	var dx = event.clientX- stage.canvas.offsetLeft + stage.canvasposx;
	var dy = event.clientY - stage.canvas.offsetTop + stage.canvasposy;
	stage.player.shoot(dx,dy);
}





function updateHighscore(user, new_score){
	//Updates highscore for the current user.
	$.ajax({
		method:"POST",
		url:"/ftd/api/highscores/",
		data: {
			username: user,
			score: new_score
		}
	}).done((data) => {
	})
}

function getHighscore(user){
	//Gets the highscore for the current user  
	$.ajax({
		method:"GET",
		url:"/ftd/api/highscores/" + user
	}).done((data) => {
	})
}

function displayHighscores(location){
	//Gets the highscores of the top ten registered players
	$.ajax({
		method:"GET",
		url:"/ftd/api/highscores/"
	}).done((data) => {
		topten = '<h3>HIGHSCORES</h3><hr>';
		for (var i = 0; i < data.users.length && i < 10; i++) {
			topten = topten + data.users[i]["username"] + " | " + data.users[i]['score'] + "<br><br>";
		}
		$(location).html(topten);
	})
}

$(document).ready(function(){
	// Setup all events here and display the appropriate UI
	setupGame();
	startGame();
});




function send(){
	var msg = {
			type: "message",
			text: $('#message').val()
	};
	socket.send(JSON.stringify(msg));
	$('#message').val("");
}

function playerMoves(x,y){
	var msg = {
		type: "playerMove",
		player_id: stage.id,
		posx: x,
		posy: y
	};
	socket.send(JSON.stringify(msg));
}

function playerShoots(position,velocity){
	var msg = {
		type: "newBullet",
		player_id: stage.id,
		posx: position.x,
		posy: position.y,
		vx: velocity.x,
		vy: velocity.y
	};
	socket.send(JSON.stringify(msg));
}

function playerDies(){
	var msg = {
		type: "playerDead",
		player_id: stage.id
	}
	socket.send(JSON.stringify(msg));
}

function updateEnemy(data){
	
	for(var player in data.positions ){

		if(player in stage.enemyID){
			if(player != stage.id){
				stage.enemyID[player].setPos(data.positions[player][0],data.positions[player][1]);
			}
		}
		else{
			var posx = data.positions[player][0];
			var posy = data.positions[player][1];
			var new_player = new NPC_Enemies(stage,images.gun_player,posx,posy,player_width,player_height);
	
			stage.addOtherPlayer(new_player,player);
			console.log("add other player " + player);
		}
	}

	for(var i=0;i<data.bullet.length;i++){
		var bullet_data = data.bullet[i];
		var pos = new Pair(bullet_data.posx,bullet_data.posy);
		var velocity = new Pair(bullet_data.vx,bullet_data.vy);
		var ball = new Ball(this.stage,pos,velocity,'black',5,5);
		stage.addActor(ball);
	}
	
}

function parse_socket(data){
	var parsed_data = JSON.parse(data);

	switch(parsed_data.type){
		case 'yourPlayer':
			var p = new Player(stage,images.gun_player,parsed_data.posx, parsed_data.posy,player_width,player_height);
			stage.addPlayer(p);
			stage.fixView();
			stage.id = parsed_data.player_id;
			stage.enemyID[parsed_data.player_id] = p;


			break;
		case 'playerState':
			updateEnemy(parsed_data);
			break;
		case 'newBullet':
			for(var i=0;i<parsed_data.bullet.length;i++){
				var bullet_data = parsed_data.bullet[i];
				var pos = new Pair(bullet_data.posx,bullet_data.posy);
				var velocity = new Pair(bullet_data.vx,bullet_data.vy);
				var ball = new Ball(this.stage,pos,velocity,'black',5,5);
				stage.addActor(ball);
			}
			
			break;
		case 'playerDead':
			if(msg.player_id in stage.enemyID){
				stage.removeEnemy(stage.enemyID[msg.player_id]);
				delete stage.enemyID[msg.player_id];
			}
			break;
	}
}
