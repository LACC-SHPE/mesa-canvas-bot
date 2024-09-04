const config = require('../config.json');
const cheerio = require('cheerio')
const axios = require("axios");

const generator = require('./htmlGenerator.js');

const baseURL = "https://ilearn.laccd.edu";
const endpoint = "/api/v1/announcements";

const db = require('./db')

const params = {
    context_codes: config.COURSES
};

const headers = {
    'Authorization': `Bearer ${config.CANVA_TOKEN}`
};

const fetchAnnouncements = async () => {
    try {
        const response = await axios.get(`${baseURL}${endpoint}`, {
            headers: headers,
            params: params
        });

        // Parse the response data
        const announcements = response.data;
        const parsedAnnouncements = announcements[0];

        const $ = cheerio.load(parsedAnnouncements.message);

        const links = [];

        $('a').each((i, link) => {
            const href = $(link).attr('href');
            links.push(href);
        });

        const announcement = {
            id: parsedAnnouncements.id,
            title: parsedAnnouncements.title,
            createdAt: parsedAnnouncements.created_at,
            author: parsedAnnouncements.author.display_name,
            author_picture: parsedAnnouncements.author.avatar_image_url,
            message: parsedAnnouncements.message,
            links: links,
            url: parsedAnnouncements.url,
        }

        // Function to get the existing IDs
        const getExistingIds = () => {
            return new Promise((resolve, reject) => {
                db.getAnnouncementIds((err, ids) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ids);
                    }
                });
            });
        };

        // Handling of insertion to the database
        const insertAnnouncement = (announcement) => {
            return new Promise((resolve, reject) => {
                db.insertAnnouncement(announcement, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };

        // Get existing IDs and check for duplicates
        const existingIds = await getExistingIds();
        
        // Comment this out for debugging purposes
        if (existingIds.includes(announcement.id.toString())) {
            console.log(announcement);
            return;
        }

        insertAnnouncement(announcement);

        // Generate the HTML template using the function
        const htmlTemplate = generator.generateHTMLTemplate(announcement);

        // Generate the image using the function
        await generator.generateImage(htmlTemplate); 

        return announcement;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return [{
            error: `An error occurred: ${error.message}`,
            success: false
        }];
    }
};

module.exports = {
    fetchAnnouncements
};