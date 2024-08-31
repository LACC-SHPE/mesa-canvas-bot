const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../announcements.db');

const getAnnouncementIds = (callback) => {
    const db = new sqlite3.Database(dbPath);

    db.all('SELECT id FROM announcements', [], (err, rows) => {
        if (err) {
            console.error('Error fetching announcement IDs:', err.message);
            callback(err, null);
            return;
        }

        const ids = rows.map(row => row.id);
        callback(null, ids);
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        }
    });
};

// Function to insert an announcement
const insertAnnouncement = (announcement) => {
    const db = new sqlite3.Database(dbPath);

    // Check if the announcement ID already exists
    db.get('SELECT id FROM announcements WHERE id = ?', [announcement.id], (err, row) => {
        if (err) {
            console.error('Error querying the database:', err);
            return;
        }
        if (!row) {
            // Insert the new announcement
            const stmt = db.prepare(`
                INSERT INTO announcements (id, title, createdAt, author, author_picture, message, url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            stmt.run(
                announcement.id,
                announcement.title,
                announcement.createdAt,
                announcement.author,
                announcement.author_picture,
                announcement.message,
                announcement.url,
                (err) => {
                    if (err) {
                        console.error('Error inserting announcement:', err);
                    } else {
                        console.log('Announcement inserted successfully.');
                    }
                }
            );
            stmt.finalize();
        } else {
            console.log('Announcement ID already exists. Skipping.');
            return false;
        }
    });

    db.close();
};

module.exports = {
    insertAnnouncement,
    getAnnouncementIds
};
