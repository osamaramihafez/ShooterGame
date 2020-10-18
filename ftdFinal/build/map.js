
function randint(max){ return Math.floor(Math.random() * max); }

var images = {
    machine_gun: 'sprites/Loot-weapon-m249.png',
    pistol: 'sprites/gun.png',
    ammo: 'sprites/ammo.png',
    naked_player: 'sprites/player_improved.png',
    gun_player:'sprites/player_with_gun.png',
    health_pack: 'sprites/health_pack.png',
    house_inside:'sprites/house_inside.png',
    house_outside: 'sprites/house_outside.png'
}

var trees = [[456,612],[852,887],[2040,1127],[1296,1367], 
[1548,743],[924,2591],[2616,803],[2268,2099],[1524,1991],
[492,1655],[1320,3107],[558,3263],[1824,2771],[972,2015],
[396,2267],[2892,2207],[2904,1595],[2184,1583],[408,2843],[2400,2723],
[1176,3719],[384,3791],[2500,3191],[1848,3275],[3204,3551],[4056,3179],
[4464,2500],[4452,1847],[3744,2500],[3528,1931],[2450,3659],[3036,2723],[1836,3719]];

var rocks = [[468,4439],[2952,4655],[972,4619],[2316,4175],[1824,4523],[1308,4151]];
var npcs = [[3648,4057],[4512,4327],[3960,4573],[4224,3817],[2004,433],[3108,1117],[1716,1501],[1272,2341]];


// here is where we add objects to the map want to seperate style and logic
function make_map(stage){
    stage.addPlayer(new Player(stage,images.naked_player ,Math.floor(stage.width/2), Math.floor(stage.height/2),player_width,player_height));
    stage.addItem(new Gun(stage,images.machine_gun,40,40,100,100,'gun'));
    stage.addItem(new Gun(stage,images.pistol,80,80,2300,2200,'gun'));
    stage.addItem(new Ammo(stage,images.ammo,20,20,2200,2200,'ammo'));
    stage.addItem(new Item(stage,images.health_pack,20,20,2300,2300,'health'));

    var canvw = stage.width;
    var canvl = stage.height;
    for (var i = 0; i<30; i++){
        x = randint(canvw);
        y = randint(canvl);
        stage.addItem(new Gun(stage,images.pistol,80,80,x,y,'gun'));

    }
    for (var i = 0; i<trees.length; i++){
        stage.addHittable(new hittableObject(stage,'sprites/tree.png',100,100,trees[i][0],trees[i][1],true));
    }

    for (var i = 0; i<rocks.length; i++){
        stage.addHittable(new hittableObject(stage,'sprites/rock.png',70,70,rocks[i][0],rocks[i][1],false));
    }
    for (var i = 0; i<npcs.length; i++){
        stage.addEnemy(new NPC_Enemies(stage, images.gun_player ,npcs[i][0], npcs[i][1],player_width,player_height));
    }
    var game_house = new house(stage,images.house_outside,1000,1000,4000,0);
    stage.type.house = game_house;
    


}

function make_grid(ctx){
    for(var i = 0; i <49;i++){
        ctx.beginPath();
        ctx.moveTo(100 + i*100, 0);
        ctx.lineTo(100 + i*100, 5000);
        ctx.stroke();
    }
    for(var i = 0; i <49;i++){
        ctx.beginPath();
        ctx.moveTo(0, 100 + i*100);
        ctx.lineTo(5000, 100 + i*100);
        ctx.stroke();
    }
}