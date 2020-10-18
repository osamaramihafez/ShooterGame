stage=null;
view = null;
interval=null;
interval2 = null;
var Keys = {
    up: -1,
    down: -1,
    left: -1,
    right: -1
};
var guns = {
    machine_gun: 'sprites/Loot-weapon-m249.png',
	pistol: 'sprites/gun.png',
	ammo: 'sprite/ammo.png'
}
moveMap = {'a':true,'s':true,'d':true,'w':true};

function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKeydown);
	document.addEventListener('keyup', moveByKeyup);
	document.addEventListener('mousemove', lookDirection);
	document.addEventListener('mousedown', shotDirection);

}
function startGame(){
	// var gamover = document.getElementById('gamover');
	// gamover.style.display = "none";
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
	interval2=setInterval(function(){ for(var x = 0; x<stage.type.enemies.length;x++){stage.type.enemies[x].move();} },1000)
}
function pauseGame(){
	clearInterval(interval);
	clearInterval(interval2);
	interval=null;
	interval2=null;
}

function gameOver(){
	var user = stage.user;
	var score = stage.score;
	pauseGame();
	stage = null;
	var gamover = document.getElementById('gameover');
	var canvas = document.getElementById('stage');
	// canvas.style.display = "none";
	// gamover.style.display = "block";
	$("#gameOver").show();
	$("#gameOver").children().show();
	$("#ui_game").children().hide();
	$("#ui_game").hide();
	document.removeEventListener('keydown', moveByKeydown);
	document.removeEventListener('keyup', moveByKeyup);
	document.removeEventListener('mousemove', lookDirection);
	document.removeEventListener('mousedown', shotDirection);
	updateHighscore(user, score);
	displayHighscores("#gameOverHighscores");
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
	var status = document.getElementById('status');
	status.innerHTML = dx +" | " + dy;
	
	stage.player.direction(dx,dy);
}

function shotDirection(event){
	var dx = event.clientX- stage.canvas.offsetLeft + stage.canvasposx;
	var dy = event.clientY - stage.canvas.offsetTop + stage.canvasposy;
	stage.player.shoot(dx,dy);
}

function login(){

	if(!$("#loginUsername").val() || !$("#loginPassword").val()){
		$("#logError").innerHTML = "Must fill in both Username and Password Field";
		$("#logError").show();
		return;
	}

	$.ajax({
		method:"GET",
		url:"/ftd/api/user/"+ $("#loginUsername").val() + "/password/" + $("#loginPassword").val()
	}).done((data) => {
		if (data.success == true){
			$("#ui_login").children().hide();
			$("#ui_login").hide();
			$("#ui_game").children().show();
			$("#ui_game").show();
			setupGame(); startGame();
			stage.setUser(data.username);
		}
		else if (data.showError == true){
			$("#Error").show();
			$("#logUserError").show();
		}
	}).fail()
}

function register(){
	//
	$.ajax({
		method:"POST",
		url:"/ftd/api/users/",
		data: {
			username: $("#registerUsername").val(),
			password: $("#registerPassword").val(),
			email: $("#registerEmail").val(),
			games: 0
		}
	}).done((data) => {
		if (data.showError){
			$("#regUserError").html(data.error);
			$("#Error").show();
			$("#regUserError").show();
		}
		else{
			$("#Error").hide();
			$("#regUserError").hide();			
			$("#ui_login").children().show();
			$("#ui_login").show();
			$("#ui_registration").children().hide();
			$("#ui_registration").hide();
			$("#Error").hide();
			$("#logPassError").hide();
			$("#logUserError").hide();
		}
	})
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

// $(document).ready(function(){
// 	// Setup all events here and display the appropriate UI
// 	$("#loginSubmit").on('click',function(){ login(); });
// 	$("#registerSubmit").on('click',function(){ register(); });
// 	$("#create").on('click', ()=>{
// 		$("#ui_login").children().hide();
// 		$("#ui_login").hide();
// 		$("#ui_registration").show();
// 		$("#ui_registration").children().show();
// 		$("#Error").children().hide();
// 		$("#regUserError").hide();
// 		$("#Error").hide();
// 	});
// 	$("#Restart").on('click',function(){ restart(); });
// 	$("#ui_login").show();
// 	$("#highscores").show();
// 	$("#highscores").children().show();
// 	$("#ui_registration").children().hide();
// 	$("#ui_registration").hide();
// 	$("#ui_game").children().hide();
// 	$("#ui_game").hide();
// 	$("#Error").hide();
// 	$("#Error").children().hide();
// 	$("#gameOver").children().hide();
// 	$("#gameOver").hide();
// 	displayHighscores("#highscores");
// });