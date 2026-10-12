CREATE TABLE sessions ( id TEXT PRIMARY KEY, info TEXT);
CREATE TABLE watchData(sessionId TEXT, type TEXT, info TEXT, Foreign Key (sessionId) references sessions (id))
