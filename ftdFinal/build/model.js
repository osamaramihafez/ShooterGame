function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

var player_width = 60;
var player_height = 60;

var guns = {
    machine_gun: 'sprites/Loot-weapon-m249.png',
	pistol: 'sprites/gun.png',
	ammo: 'sprite/ammo.png'
}

class Stage {
	constructor(canvas){
		this.canvas = canvas;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.type = {
			hittable: [], // objects that change when hit i.e players,certain map objects
			enemies:[], // ais
			items: [],// ammo, guns, life
			house: null 
		}
		
		this.player=null; // a special actor, the player
		this.score = 0;
		// the logical width and height of the stage
		this.width=5000;
		this.height=5000;
		this.canvasposx = 2100;
		this.canvasposy = 2200;

		// build map function should go here
		make_map(this);

	}

	setUser(username){
		this.user=username;
	}

	increase_score(){
		this.score += 10;
		var score = document.getElementById('score');
		score.innerHTML = ""+ this.score;
	}

	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addball(dx,dy){
		var x = this.player.x;var y = this.player.y;
		var vx = dx -x; var vy = dy - y;
		var velocity = new Pair(vx,vy);
		velocity.normalize();
		var pos = new Pair(x,y);
		var ball = new Ball(this,pos,velocity,'black',5,5);
		this.actors.push(ball);
	}

	addActor(actor){
		this.actors.push(actor);
	}

	addHittable(hittable){
		this.addActor(hittable);
		this.type.hittable.push(hittable);
	}

	
	addItem(a){
		this.type.items.push(a);
		this.addActor(a);
	}

	addEnemy(enemy){
		this.type.enemies.push(enemy);
		this.addHittable(enemy);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	removeHittable(actor){
		var index=this.type.hittable.indexOf(actor);
		if(index!=-1){
			this.type.hittable.splice(index,1);
		}
	}
	
	removeEnemy(enemy){
		var index=this.type.enemies.indexOf(enemy);
		if(index!=-1){
			this.type.enemies.splice(index,1);
		}
		this.removeHittable(enemy);
		this.removeActor(enemy);
	}

	removeItem(a){
		var index=this.type.items.indexOf(a);
		if(index!=-1){
			this.type.items.splice(index,1);
		}
		this.removeActor(a);
	}

	step(){
		this.type.house.step();
		for(var i=0;i<this.actors.length;i++){
				this.actors[i].step();
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');

		context.save();
		context.translate(-this.canvasposx,-this.canvasposy);
		context.clearRect(0, 0, this.width, this.height);
		context.fillStyle = "#FF0000";
		context.fillRect(-1000,-1000,this.width*2,this.height*2);
		context.fillStyle = "#00cc00";
		context.fillRect(0,0,this.width,this.height);

		make_grid(context);
		this.type.house.draw(context);
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
		}
		context.drawImage(new Image(), this.x,this.y,this.width,this.height);
		context.restore();

	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}

		return null;
	}
} 

class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y*this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}

// This is our bullet class 
class Ball {
	constructor(stage, position, velocity, colour, radius,speed){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position
		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
		this.speed =speed;
		this.distance = 0;
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		this.distance++;
		if (this.distance > 100){
			this.stage.removeActor(this);
		}

		var oldx = this.position.x; var oldy = this.position.y;
		this.position.x=this.position.x+this.velocity.x*this.speed;
		this.position.y=this.position.y+this.velocity.y*this.speed;

		if(this.stage.type.house.hit_house_border(this.position.x,this.position.y,oldx,oldy)){
			this.stage.removeActor(this);
		}

		// check if it hit a hittable object
		for(var i=0;i<this.stage.type.hittable.length;i++){
			if(this.stage.type.hittable[i].in_range(this.position.x,this.position.y) ){
				this.stage.type.hittable[i].hit(this);
			}
		}

		if(this.stage.player.in_range(this.position.x,this.position.y)){
			this.stage.player.hit(this);
		}
			
		// bounce off the walls ()
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
			//this.stage.removeActor(this);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
			//this.stage.removeActor(this);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
			//this.stage.removeActor(this);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
			//this.stage.removeActor(this);
		}
		this.intPosition();
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		context.fillStyle = this.colour;
		
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();
	}
}

// consists of objects that can be picked up
class Item {
	constructor(stage,image_src,width,height,posx,posy,name){
		this.stage = stage;
		this.sprite = new Image();
		this.sprite.src = image_src;
		this.height = height;this.width= width;
		this.x = posx; this.y = posy;
		this.player_in_range = false;
		this.used = false;
		this.ammo = randint(10);
		this.name = name;
	}
	// player in range of gun to pick up
	in_range(px,py){
		var l = Math.sqrt((px - (this.x+(this.width/2)))**2+(py-(this.y+(this.height/2)))**2);
		if (l <= this.width){
			return true;
		}
		else{
			return false;
		}
	}

	update_position(x, y){
		this.x = x; this.y = y;
	}

	step(){
		if(this.in_range(this.stage.player.x,this.stage.player.y)){
			this.player_in_range = true;
		}else{
			this.player_in_range = false;
		}
	}
	draw(context){
		if(this.player_in_range){
			context.beginPath();
			context.font = "15px Arial";
			context.fillText("pick up press E",this.x,this.y-20,this.width*2);
		}
		context.drawImage(this.sprite, this.x,this.y,this.width,this.height);
	}
}

// ammo class for future remodeling
class Ammo extends Item {
	constructor(stage,image_src,width,height,posx,posy,name){
		super(stage,image_src,width,height,posx,posy,name);
	}
}




class Gun extends Item{ 
	constructor(stage,image_src,width,height,posx,posy,name){
		super(stage,image_src,width,height,posx,posy,name);
		this.ammo = 10; //Each gun should come with it's own ammo
		this.capacity =10; // change later
		this.type = 1;
	}

	

	get_ammo(){
		return this.ammo;
	}

	reload(){
		this.ammo = this.capacity;
		
		var ammo_display = document.getElementById("ammo_info");
		ammo_display.innerHTML = this.ammo +" / "+this.capacity;
	}

	shoot(dx,dy){
		this.ammo--;
		var x = this.stage.player.x;var y = this.stage.player.y;
		var vx = dx -x; var vy = dy - y;
		var velocity = new Pair(vx,vy);
		velocity.normalize();
		var res = move_x_to_d(velocity,this.stage.player.width/2);
		x+=res[0];y+= res[1];
		var pos = new Pair(x,y);
		var ball = new Ball(this.stage,pos,velocity,'black',5,5);
		this.stage.addActor(ball);
		var ammo_display = document.getElementById("ammo_info");
		ammo_display.innerHTML = this.ammo +" / "+this.capacity;
	}

}


class hittableObject{
	constructor(stage,image_src,width,height,posx,posy,can_go_through){
		this.stage = stage;
		this.sprite = new Image();
		this.sprite.src = image_src;
		this.height = height;this.width= width;
		this.x = posx; this.y = posy;
		this.can_go_through = can_go_through
	}

	hit(ball){
		this.width -= 10;
		this.height -= 10;
		if(this.width == 0 || this.height == 0){
			this.stage.removeActor(this);
			this.stage.removeHittable(this);
		}
		this.stage.removeActor(ball);

	}

	in_range(px,py){
		var x = this.x+(this.width/2); var y = this.y+(this.height/2);
		var l = Math.sqrt((px-x)**2 + (py -y)**2);
		if (l <= this.width/2){
			return true;
		}
		else{
			return false;
		}
	}
	
	step(){}

	draw(context){
		context.drawImage(this.sprite, this.x,this.y,this.width,this.height);
	}



}

class Inventory{
	constructor(player){
		this.player = player;
		this.stage = this.player.stage;
		this.items = [null, null, null, null, null, null, null]; //The actual list of items (7 in total)
		this.selected = 0; //Index of the item in use.
		document.getElementById('0').style.borderColor = "green";


	}
	
	add_item(gun){
		// add item is going to add the item to the inventory
		
		var item = gun;
		
		// if the current selected is empty
		// this should trigger a player sprite change to one with a gun  
		if (this.items[this.selected] == null){
			this.items[this.selected] = item;
			var weapon_name = document.getElementById("weapon_name");
			var ammo_display = document.getElementById("ammo_info");
			weapon_name.innerHTML = "Gun";
			ammo_display.innerHTML = item.ammo +" / "+item.capacity;
			this.stage.player.sprite.src = images.gun_player;
			return this.selected;
		}
		
		//Look for an empty slot
		// this should trigger a player sprite change to one with a gun  
		for (var i =0; i<this.items.length; i++){
			
			if (this.items[i] == null){
				this.items[i] = item;
				return i;
			}
		}

		return false;
	}

	pickup_ammo(){
		if(this.items[this.selected] == null){return false;}
		if(this.items[this.selected].ammo == this.items[this.selected].capacity){return false;}
		this.items[this.selected].reload();
		
		return true;

	}

	current_item(){
		return this.items[this.selected];
	}

	drop_item(){

		if (this.items[this.selected] != null){
			
			this.items[this.selected].update_position(this.player.x, this.player.y);
			this.stage.addGun(this.items[this.selected]);
			this.items[this.selected] = null;
			var itemslot = document.getElementById(this.selected.toString());
			itemslot.src = "";
			var weapon_name = document.getElementById("weapon_name");
			var ammo_display = document.getElementById("ammo_info");
			weapon_name.innerHTML = "None";
			ammo_display.innerHTML = "None";
			return true;
		}
		return false;
	}

	choose_item(index){

		document.getElementById(this.selected.toString()).style.borderColor = "black";
		document.getElementById(index).style.borderColor = "green";
		var weapon_name = document.getElementById("weapon_name");
		var ammo_display = document.getElementById("ammo_info");
		if(this.items[index] != null){
			weapon_name.innerHTML = "Gun";
			ammo_display.innerHTML = this.items[index].ammo +" / "+this.items[index].capacity;
			this.stage.player.sprite.src = images.gun_player;
		}
		else{
			weapon_name.innerHTML = "None";
			ammo_display.innerHTML = "None";
			this.stage.player.sprite.src = images.naked_player;
		}
		this.selected = parseInt(index);
	}

	
	count_ammo(){
		if (this.items[this.selected] != null){
			return this.items[this.selected].get_ammo();
		}
		return 0;
	}

	step(){}

	draw(context){

	}
}

class house{
	constructor(stage,image_src,width,height,posx,posy){
		this.stage = stage;
		this.sprite = new Image();
		this.sprite.src = image_src;
		this.height = height;this.width= width;
		this.x = posx; this.y = posy;
	}
	// check if player in range 
	entrance_range_left(px,py){
		var l = Math.sqrt((px-this.x)**2 + (py -(this.y + (this.height/2)) )**2);
		
		if (l <= 100){
			
			return true;
		}
		else{
			return false;
		}
	}

	entrance_range_bottom(px,py){
		var l = Math.sqrt((px-(this.x+(this.width/2)))**2 + (py -(this.y + (this.height)))**2);
		if (l <= 100){
			return true;
		}
		else{
			return false;
		}
	}
	
	is_inside(px,py){
		if((px > this.x) && px< (this.x + this.width) && (py > this.y) && (py< (this.y+ this.height))){
			return true;
		}
		return false;
	}

	hit_house_border(px,py,oldx,oldy){
		if(this.entrance_range_bottom(px,py) || this.entrance_range_left(px,py)){return false;}
		
		if(this.is_inside(oldx,oldy)){
			if(!this.is_inside(px,py)){return true;}

		}else{
			if( px > this.x && px < (this.x + this.width)  && py > this.y  && py < (this.y + this.height)){return true;}
		}
		
		return false;
	}


	step(){
		if(this.is_inside(this.stage.player.x,this.stage.player.y)){
			this.sprite.src = images.house_inside;
		}else{
			this.sprite.src = images.house_outside;
		}
	}

	draw(context){
		context.drawImage(this.sprite, this.x,this.y,this.width,this.height);

	}

}


class Player{
	constructor(stage,image_src,posx,posy,width,height){
		this.stage = stage;
		this.x = posx;
		this.y = posy;
		this.width = width;this.height = height;
		this.sprite = new Image();
		this.sprite.src = image_src;
		this.speedx = 0;
		this.speedy = 0;
		this.vx = 0; this.vy= 0;
		this.speedup = 3;
		this.health = 100;
		this.inventory = new Inventory(this);
		this.lifes = 1;
		this.ammo = this.inventory.count_ammo();
	
	
	}

	move(Keys){
		this.speedx = 0;
		this.speedy = 0;
		if(Keys.up == true)this.speedy = -1*this.speedup;
		if(Keys.down == true)this.speedy = 1*this.speedup;
		if(Keys.left == true)this.speedx = -1*this.speedup;
		if(Keys.right == true)this.speedx = 1*this.speedup;
	}
	
	direction(dx,dy){
		this.vx = dx;this.vy= dy;
	}
	
	choose_inventory(key){
		this.ammo = this.inventory.count_ammo();
		var index = parseInt(key, 10) - 1;
		this.inventory.choose_item(index);
	}

	step(){
		var oldx = this.x; var oldy = this.y;
		this.x += this.speedx;
		this.y += this.speedy;
		this.stage.canvasposx += this.speedx;
		this.stage.canvasposy+= this.speedy;
		if(hit_border(this.stage,this.x,this.y,oldx,oldy)){
				this.x -= this.speedx;
				this.y -= this.speedy;
				this.stage.canvasposx -= this.speedx;
				this.stage.canvasposy -= this.speedy;
		}


	}

	in_range(px,py){
		var l = Math.sqrt((px-this.x)**2 + (py -this.y)**2);
		if (l <= this.width/2){
			return true;
		}
		else{
			return false;
		}
	}

	hit(ball){
			if (this.health > 10){
				this.health -= 10;
			}
			else {
				this.health = 100
				this.lifes -= 1;
				if(this.lifes <= 0){
					gameOver();
				}
			}
			this.stage.removeActor(ball);
		
	}
	// ai that punches
	punched(){
		if (this.health > 20){
			this.health -= 20;
		}
		else {
			this.health = 100
			this.lifes -= 1;
			if(this.lifes <= 0){
				gameOver();
			}
		}
	}

	increase_life(){
		this.lifes += 1;
		var life = document.getElementById('life');
		life.innerHTML = ""+ this.lifes;
	}

	// add more to this
	pickup_item(){
		var item = null;
		for(var i=0;i<this.stage.type.items.length;i++){
			if(this.stage.type.items[i].in_range(this.x,this.y)){
				item = this.stage.type.items[i];
				if(item.name == 'gun'){
					var res = this.inventory.add_item(item);
					if(res != false){this.stage.removeItem(item);}
					return res;
				}
				else if(item.name == 'ammo'){
					var res = this.inventory.pickup_ammo();
					if(res){this.stage.removeItem(item);}
				}
				else if(item.name == 'health'){
					this.increase_life()
					this.stage.removeItem(item);
				}
			}
		}
	}

	drop_item(){
		this.inventory.drop_item();
	}

	// player shoots 
	shoot(dx,dy){
		var gun = this.inventory.current_item();
		if(gun == null){return;}
		if (gun.get_ammo() > 0){
			gun.shoot(dx,dy);
		}

	}

	draw(context){
		// draw player facing mouse
		context.save();
		context.beginPath();
		context.translate(this.x,this.y);
		context.rotate(Math.atan2(this.vy - (this.y), this.vx - (this.x)) + Math.PI / 2);
		context.drawImage(this.sprite, -(this.width/2),-(this.height/2),this.width,this.height);
		context.restore();


		//drawing line of sight for testing
		context.beginPath();
		context.moveTo(this.x,this.y);
		context.lineTo(this.vx,this.vy);
		context.stroke();

		//draw health bar green side
		var healthy = this.y - (this.height/2)  - 16 - 10;
		var healthx = this.x - (this.width/2);
		context.fillStyle = "#39FF14";
		context.fillRect(healthx,healthy,this.width*(this.health/100),10);


		//draw health bar red side 
		context.fillStyle = "#ff073a";
		healthx += this.width*(this.health/100);
		context.fillRect(healthx,healthy,this.width*(1-this.health/100),10);
	}

}


class NPC_Enemies { //extend hittable object
	constructor(stage,image_src,posx,posy,width,height){
		this.stage = stage;
		this.x = posx;
		this.y = posy;
		this.width = width;this.height = height;
		this.sprite = new Image();
		this.sprite.src = image_src;
		this.speedx = 0;
		this.speedy = 0;
		this.vx = 0;this.vy= 0;
		this.movex = 0;this.movey = 0;
		this.speedup = 1;
		this.health = 100;
		this.can_go_through = true;
	}

	// called at a certain interval if player in range face and shoot
	shoot(dx,dy){
		var x = this.x;var y = this.y;
		var vx = dx -x; var vy = dy - y;
		var velocity = new Pair(vx,vy);
		velocity.normalize();
		var res = move_x_to_d(velocity,this.width/2);
		x+=res[0];y+= res[1];
		var pos = new Pair(x,y);
		var ball = new Ball(this.stage,pos,velocity,'black',5,5);
		this.stage.addActor(ball);
	}

	// need to fill this in 
	hit(ball){

		if (this.health > 10){
			this.health -= 10;
		}
		else {
			this.stage.increase_score();
			
			this.stage.removeEnemy(this);
			this.stage.addItem(new Ammo(stage,images.ammo,20,20,this.x,this.y,'ammo'));
		}
		this.stage.removeActor(ball);
	}
	// length of range increased 
	in_range(px,py){
		var l = Math.sqrt((px-this.x)**2 + (py -this.y)**2);
		if (l <= this.width/2){
			return true;
		}
		else{
			return false;
		}
	}

	in_shooting_range(px,py){
		var l = Math.sqrt((px-this.x)**2 + (py -this.y)**2);
		if (l <= this.width*3){
			return true;
		}
		else{
			return false;
		}
	}

	

	// called at a certain interval 
	// if player in range do nothing 
	// move at a random direction 
	move(){
		if(this.in_shooting_range(this.stage.player.x,this.stage.player.y)){
			this.shoot(this.stage.player.x,this.stage.player.y);
		}else{
			var items = [-1,0,1];
			this.movex = items[Math.floor(Math.random() * items.length)];
			this.movey = items[Math.floor(Math.random() * items.length)];
			this.vx = this.x + this.movex*stage.width;
			this.vy = this.y + this.movey*this.stage.height;
		}
	}

	move_to_player(){
		var dx = this.vx - this.x; var dy = this.vy-this.y;
		if(dx != 0 && dy != 0){
			return [dx/Math.abs(dx), dy/Math.abs(dy)];
		}
		else if(dx == 0){
			return [0, dy/Math.abs(dy)];
		}
		else{
			return [dx/Math.abs(dx), 0];
		}
		
	}
	
	// move towards the player if in range
	step(){
		var oldx = this.x; var oldy = this.y;
		if(this.in_shooting_range(this.stage.player.x,this.stage.player.y)){
			this.vx = this.stage.player.x; this.vy = this.stage.player.y;
			var res = this.move_to_player();
			this.x += res[0]*this.speedup;
			this.y += res[1]*this.speedup;
			
			if(this.stage.player.in_range(this.x,this.y) || hit_border(this.stage,this.x,this.y,oldx,oldy)){
				this.x -= res[0]*this.speedup;
				this.y -= res[1]*this.speedup;
			}
		}else{
			
			this.x += this.movex*this.speedup;
			this.y += this.movey*this.speedup;
			if(this.stage.player.in_range(this.x,this.y) || hit_border(this.stage,this.x,this.y,oldx,oldy)){
				this.x -= this.movex*this.speedup;
				this.y -= this.movey*this.speedup;
			}
		}

	}

	draw(context){
		// draw player facing mouse
		context.save();
		context.translate(this.x,this.y);
		context.rotate(Math.atan2(this.vy - (this.y), this.vx - (this.x)) + Math.PI / 2);
		context.drawImage(this.sprite, -(this.width/2),-(this.height/2),this.width,this.height);
		context.restore();

		//draw health bar green side
		var healthy = this.y - (this.height/2)  - 16 - 10;
		var healthx = this.x - (this.width/2);
		context.fillStyle = "#39FF14";
		context.fillRect(healthx,healthy,this.width*(this.health/100),10);

		
		//draw health bar red side 
		context.fillStyle = "#ff073a";
		healthx += this.width*(this.health/100);
		context.fillRect(healthx,healthy,this.width*(1-this.health/100),10);

	}

}


// want to move x pixels from p1 to p2
function move_x_to_d(velocity,pixels){
	var angle = Math.atan(velocity.y/velocity.x);
	var addx = (pixels)*Math.cos(angle);
	var addy = (pixels)*Math.sin(angle);
	if(velocity.x < 0){
		return [-1*addx,-1*addy];
	}else{
		return [addx,addy];
	}

}

// checks if position is at border or non hittable objects
// this is for player and npcs 
function hit_border(stage,x,y,oldx,oldy){
	// check if we're atn object thats not hittable
	for(var i=0;i<stage.type.hittable.length;i++){
		if(stage.type.hittable[i].in_range(x,y) && !this.stage.type.hittable[i].can_go_through){
			return true;
		}
	}
	// check house borders 
	if(stage.type.house.hit_house_border(x,y,oldx,oldy)){
		return true;
	}

	

	// check walls
	if(x<0){
		return true;
	}
	if(x>stage.width){
		return true;
	}
	if(y<0){
		return true;
	}
	if(y>stage.height){
		return true;
	}
	return false;
}

