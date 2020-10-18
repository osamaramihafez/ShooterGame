/*
 * What about serving up static content, kind of like apache?
 * This time, you are required to present a user and password to the login route
 * before you can read any static content.
 */

var port = 10038; // REPLACE THIS WITH YOUR PORT

var express = require('express');
var cookieParser = require('cookie-parser');
// var react = require('./static_files/App.js');
var path = require('path');

const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

var db = new sqlite3.Database('db/database.db', (err) => {
	if (err) {
			console.error(err.message);
	}
	console.log('Connected to the database.');
});


var app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------------------------------------------------
// BEGIN: To restrict access to /
// ----------------------------------------------------------------------------------



//login
app.get('/ftd/api/user/:username/password/:password',function(req,res){
	var username = req.params.username;
	var password = req.params.password;
	let sql = 'SELECT username, password FROM Users WHERE username=? and password=?;';
	db.get(sql, [username,password], (err, row) => {
		var result = {};
		if(err){
			res.status(404);
			result['error'] = err.message;
		}else{
			try{
				result['username'] = row.username;
				if (password == row.password){
					result['success'] = true;
				}
				result["showError"] = false;
			}catch(TypeError){
				// res.status(401);
				result["showError"] = true;
			}
		}
		// result['success'] = true;
		res.json(result);
		console.log("THAKSDKASNDMLASDLM");
	});
});


//Add a user
app.post('/ftd/api/users', function(req,res){
	console.log("kaskadnjkandsk");
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var gamesplayed = req.body.games;
	if(validate_user_pass(username) && validate_user_pass(password)){
		let sql = "INSERT INTO Users(username,password,email,numGamesPlayed) VALUES(?,?,?,?);";
		db.run(sql, [username,password,email,gamesplayed], function (err){
			var result = {};
			if(err){
				// res.status(401);
				result['error'] = "Username and Email combination not available";
				result['showError'] = true;
			}else{
				result['showError'] = false;
				result['success'] = true;
			}
			res.json(result);
		});
	}
	else{
		var result = {};
		// res.status(401);
			result['error'] = "Username and Password must be 7 to 15 characters which contain only characters, numeric digits, underscore and first character must be a letter";
			result['showError'] = true;
			result['invalidError'] = true;
		res.json(result);
	}
});


//Update a user
app.put('/ftd/api/users/:username', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var oldusername = req.params.username
	if(validate_user_pass(username) && validate_user_pass(password)){
	let sql = "UPDATE Users SET username=?, password=?, email=? WHERE username=?;";
	db.run(sql, [username,password,email,oldusername], function (err){
		var result = {};
		if(err){
			res.status(404);
			result['error'] = err.message;
		}else{
			result['success'] = true;
		}
		res.json(result);
	});
} else{
	var result = {};
	// res.status(401);
		result['error'] = "Username and Password must be 7 to 15 characters which contain only characters, numeric digits, underscore and first character must be a letter";
		result['showError'] = true;
		result['invalidError'] = true;
		res.json(result);
	}
});

app.delete('/ftd/api/users/:username', function(req,res){
	var username = req.params.username;
	let sql = "DELETE FROM Users WHERE username=?;";
	db.run(sql, [username,password], function (err){
		var result = {};
		if(err){
			res.status(401);
			result['error'] = err.message;
		}else{
			result['success'] = true;
		}
		res.json(result);
	});
});

// get highscores
app.get('/ftd/api/highscores',function(req,res){
	let sql = 'SELECT * FROM Highscore ORDER BY score DESC;';
	db.all(sql, [], (err, rows) => {
		var result = {users:[]};
		if(err){
			result['error'] = err.message;
		}else{

			rows.forEach((row) => {
				result.users.push({
					username: row.username,
					score: row.score});
			  });
		}

		res.json(result);
	});
});

// put a new score
app.post('/ftd/api/highscores/',function(req,res){
	var username = req.body.username;
	var score = req.body.score;
	let sql = 'INSERT INTO Highscore(username, score) VALUES(?, ?)';
	db.run(sql, [username, score], function (err){
		var result = {};
		if(err){
			console.log(err.message);
			res.status(404);
			result['error'] = err.message;
		}else{
			result['sucess'] = "score added";
		}
		res.json(result);
	});
});

// ----------------------------------------------------------------------------------
// END: To restrict access to /
// ----------------------------------------------------------------------------------

// app.use('/',express.static('build')); // this directory has files to be returned
app.use('/game', express.static('game_files'));

app.listen(port, function () {
  console.log('Example app listening on port '+port);
});

// validate password and username
function validate_user_pass(inputtxt)
{
	var passw= /^[A-Za-z]\w{7,14}$/;
	if(inputtxt.match(passw))
	{
		return true;
	}
	else
	{
		return false;
	}
}
