const schema = require("../schema/db_schema")
const config = require('../config.json');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio')
const axios = require("axios");
const path = require('path');
const fs = require('fs');

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
            return;
        }

        insertAnnouncement(announcement);

        // Generate the HTML template using the function
        const htmlTemplate = generateHTMLTemplate(announcement);

        // Generate the image using the function
        await generateImage(htmlTemplate); 

        return announcement;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return [{
            error: `An error occurred: ${error.message}`,
            success: false
        }];
    }
};

const generateImage = async (html) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 1080 });
    await page.setContent(html);
    await page.screenshot({ path: './cache/announcement.png', fullPage: true });
    await browser.close();
    return true;
};

const generateHTMLTemplate = (announcement) => {
    // Paths to the CSS and JS files
    const cssPath = path.resolve(__dirname, '../generator/assets/css/bootstrap.min.css');
    const jsPath = path.resolve(__dirname, '../generator/assets/js/bootstrap.min.js');
    
    // Read the HTML template file
    const htmlTemplate = fs.readFileSync(path.resolve(__dirname, '../generator/index.html'), 'utf-8');
    
    // Read the CSS and JS files
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    
    // Inject CSS and JS into the HTML template
    const updatedHTML = htmlTemplate
        .replace('<!-- INSERT_CSS_HERE -->', `<style>${cssContent}</style>`)
        .replace('<!-- INSERT_JS_HERE -->', `<script>${jsContent}</script>`)
        .replace('{AUTHOR_IMG}', announcement.author_picture)
        .replace('{AUTHOR}', announcement.author)
        .replace('{TITLE}', announcement.title)
        .replace('{MESSAGE}', announcement.message);

    return updatedHTML;
};

module.exports = {
    generateHTMLTemplate
};

module.exports = {
    fetchAnnouncements
};