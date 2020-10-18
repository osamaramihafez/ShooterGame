--- load with 
--- sqlite3 database.db < schema.sql
DROP TABLE Highscore;
DROP TABLE Users;

CREATE TABLE Users (
	username TEXT NOT NULL PRIMARY KEY,
	password TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	numGamesPlayed INTEGER
);

CREATE TABLE Highscore (
	username TEXT NOT NULL,
	score INTEGER,
	FOREIGN KEY (username)
		REFERENCES Users(username)
			ON DELETE CASCADE
			ON UPDATE NO ACTION
);

-- create trigger t on insert