const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');


const generateImage = async (html) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setContent(html);
    
    // Get the content dimensions
    const { width, height } = await page.evaluate(() => {
        return {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight
        };
    });
    
    // Set viewport based on content dimensions
    await page.setViewport({ width: width, height: height });
    
    await page.screenshot({ 
        path: './cache/announcement.png', 
        fullPage: true, 
        quality: 100, // Only works for JPEG
        type: 'jpeg' // Change to 'png' for PNG format
    });
    
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
    generateImage,
    generateHTMLTemplate
}