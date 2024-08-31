const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../announcements.db');

// Open a database connection
const db = new sqlite3.Database(dbPath);

// Create a table for announcements
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS announcements (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            author TEXT NOT NULL,
            author_picture TEXT NOT NULL,
            message TEXT NOT NULL,
            url TEXT NOT NULL
        )
    `);
});

db.close();
