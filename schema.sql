CREATE TABLE sessions ( id INTEGER PRIMARY KEY AUTOINCREMENT, info TEXT);
CREATE TABLE watchData(sessionId INT, type TEXT, info TEXT, Foreign Key (sessionId) references sessions (id))
